<?php

namespace App\Models\Aixm;

use App\Models\AixmGraphModel;
use App\Models\Auth\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use XMLReader;
use SimpleXMLElement;

class Dataset extends AixmGraphModel
{
    public $searchable = ['name', 'filename', 'description'];
    protected $withCount = ['dataset_features'];
    public static $XmlFilesFolder = 'datasets';
    public static $FeatureParentTagName = 'hasMember';


    ##################################################################################
    # Relations
    ##################################################################################
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function dataset_features()
    {
        return $this->hasMany(DatasetFeature::class);
    }

    ##################################################################################
    # Scopes
    ##################################################################################

    ##################################################################################
    # Functions
    ##################################################################################
    public function getPath() {
        return self::$XmlFilesFolder . DIRECTORY_SEPARATOR . $this->path;
    }

    public function getPathWithFileName() {
        return self::$XmlFilesFolder . DIRECTORY_SEPARATOR . $this->path . DIRECTORY_SEPARATOR . $this->filename;
    }

    public static function getNewFileSubFolder() {
        $now = Date::today();
        return $now->format('Y') . DIRECTORY_SEPARATOR .
            $now->format('m') . DIRECTORY_SEPARATOR .
            $now->format('d');
    }

    public function parse(bool $validate = false) {
        $start = microtime(true);
        Log::channel('stderr')->info('Start parsing dataset ' . $this->name);
        $this->dataset_features()->delete();

        $reader = new XMLReader();
        $reader->open(Storage::disk('private')->path($this->getPathWithFileName()));

        if ($validate) {
            Log::channel('stderr')->info('Validating dataset ' . $this->name);
            $schema = $reader->setSchema(Storage::disk('private')->path('xsd/aixm_5_1_1_xsd/message/AIXM_BasicMessage.xsd'));
        }

        try {
            // reach first feature
            while ($reader->read() && $reader->localName != self::$FeatureParentTagName) {;}
            // loop features
            while ($reader->localName == self::$FeatureParentTagName) {
                $element = new SimpleXMLElement($reader->readInnerXml());
                $feature = Feature::getFeature($element->getName());
                if ($feature?->type === 'feature') {
                    // Log::channel('stderr')->info('Read feature: ' . $name);
                    $this->parseDatasetFeature($this, $feature, $element);
                }
                $reader->next(self::$FeatureParentTagName);
                unset($element);
            }
            $reader->close();
        } catch (\Exception $exception) {
            Log::channel('stderr')->error('Error parsing dataset ' . $this->name);
            Log::channel('stderr')->error($exception->getMessage());
        }

        // update broken references
        $this->updateBrokenReferences();
        Log::channel('stderr')->info('Parsed ' . $this->dataset_features()->count() .
            ' features in ' . intval(round(1000 * (microtime(true) - $start))) . ' ms');
    }

    private function parseDatasetFeature($dataset, $feature, $element) {
        //Log::channel('stderr')->info('Feature: ' . $feature->name . ': ' . strval($element));
        $ns = array_keys($element->getNameSpaces())[0];
        $dataset_feature = $dataset->dataset_features()->create([
            'feature_id' => $feature->id,
            'gml_id_value' => strval($element->attributes('gml', true)->id),
            'gml_identifier_value' => strval($element->xpath('gml:identifier')[0])
        ]);
        // root feature with timeSlice
        $timeSlices = $element->xpath( $ns . ':timeSlice/'. $ns . ':' . $element->getName() . 'TimeSlice');
        if (sizeof($timeSlices) > 0) {
            $feature_node = $timeSlices[0];
            // save properties
            foreach ($feature->properties as $property) {
                if ($property->ref_feature?->type === 'choice') {
                    // properties with partly name equality
                    // choices -> property name from the beginning to "_"
                    $props = $feature_node->xpath('//' . $ns . ':*[starts-with(local-name(), "' . $property->name . '_")]');
                } else {
                    // properties with exact name equality
                    $props = $feature_node->xpath($ns . ':' . $property->name);
                }
                foreach ($props as $p) {
                    $this->parseDatasetFeatureProperty($dataset_feature, $property, $p, $ns);
                }
            }
        }
    }

    private function parseDatasetFeatureProperty($dataset_feature, $property, $node, $ns, $parent_dataset_feature_property_id=0) {
        //Log::channel('stderr')->info('Property: ' .$node->getName() . ': ' . strval($node));
        $value = strval($node);
        $xlink_href = '';
        $xlink_href_type = '';
        if ($property->is_xlink) {
            $xlink = strval($node->attributes('xlink', true)->href);
            $xlink_arr = preg_split('/[:.]+/', $xlink);
            $xlink_href = array_pop($xlink_arr);
            $xlink_href_type = str_replace($xlink_href, '', $xlink);
        }
        $dataset_feature_property = $dataset_feature->dataset_feature_properties()->create([
            'parent_id' => $parent_dataset_feature_property_id,
            'property_id' => $property->id,
            'gml_id_value' => strval($node->attributes('gml', true)->id),
            'xlink_href_type' => $xlink_href_type,
            'xlink_href' => $xlink_href,
            'value' => $value
        ]);

        // check if property has child feature/ object
        if ($property->ref_feature_id) {
            $feature = Feature::find($property->ref_feature_id);
            foreach ($feature->properties as $prop) {
                if ($prop->ref_feature?->type === 'choice') {
                    // properties with partly name equality
                    $pr = $node->xpath('.//' . $ns . ':*[starts-with(local-name(), "' . $prop->name . '_")]');
                } else {
                    // properties with exact name equality
                    $pr = $node->xpath('.//' . $ns . ':' . $prop->name);
                }
                foreach ($pr as $p) {
                    $this->parseDatasetFeatureProperty($dataset_feature, $prop, $p, $ns, $dataset_feature_property->id);
                }
            }
        }
    }

    private function updateBrokenReferences() {
        /**
         * UPDATE dataset_feature_properties SET is_broken=true
         * WHERE dataset_feature_id IN (SELECT id FROM dataset_features WHERE dataset_id=2)
         * AND xlink_href<>''
         * AND xlink_href NOT IN (SELECT gml_identifier_value FROM dataset_features WHERE dataset_id=2);
         */
        DB::statement("
        UPDATE dataset_feature_properties SET is_broken=true
            WHERE dataset_feature_id IN (SELECT id FROM dataset_features WHERE dataset_id=?)
              AND xlink_href<>''
              AND xlink_href NOT IN (SELECT gml_identifier_value FROM dataset_features WHERE dataset_id=?);
        ", [$this->id, $this->id]);
    }
}
