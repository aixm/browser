<?php

namespace App\Models\Aixm;

use App\Models\AixmGraphModel;
use App\Models\Auth\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
    private $xmlFilesFolder = 'datasets';
    private $featureParentTagName = 'hasMember';


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
    protected function scopeByUser(Builder $builder)
    {
        // get user this way for public routes
        $user = Auth::guard('api')->user();
        if ($user) {
            if ($user->isAdmin()) {
                // all datasets
                return $builder;
            } else {
                // user's and public datasets
                return $builder
                    ->where('user_id', '=', $user->id)
                    ->orWhere('user_id', '=', 0);
            }
        } else {
            // public datasets
            return $builder->where('user_id', '=', 0);
        }
    }

    ##################################################################################
    # Functions
    ##################################################################################
    public function getPath() {
        return $this->xmlFilesFolder . DIRECTORY_SEPARATOR . $this->path;
    }

    public function getPathWithFileName() {
        return $this->xmlFilesFolder . DIRECTORY_SEPARATOR . $this->path . DIRECTORY_SEPARATOR . $this->filename;
    }

    public static function getNewFileSubFolder() {
        $now = Date::today();
        return $now->format('Y') . DIRECTORY_SEPARATOR .
            $now->format('m') . DIRECTORY_SEPARATOR .
            $now->format('d');
    }

    public function parse() {
        $start = microtime(true);
        Log::channel('stderr')->info('Start parsing dataset ' . $this->name);
        $this->dataset_features()->delete();

        $reader = new XMLReader();
        $reader->open(Storage::disk('private')->path($this->getPathWithFileName()));

        // reach first feature
        while($reader->read() && $reader->localName != $this->featureParentTagName){;}
        // loop features
        while($reader->localName == $this->featureParentTagName){
            $element = new SimpleXMLElement($reader->readInnerXml());
            $feature = Feature::getFeature($element->getName());
            if ($feature?->type === 'feature') {
                // Log::channel('stderr')->info('Read feature: ' . $name);
                $this->parseDatasetFeature($this, $feature, $element);
            }
            $reader->next('hasMember');
            unset($element);
        }
        $reader->close();
        // update broken references
        $this->updateBrokenReferences();
        Log::channel('stderr')->info('Parsed ' . $this->dataset_features()->count() .
            ' features in ' . intval(round(1000 * (microtime(true) - $start))) . ' ms');
    }

    private function parseDatasetFeature($dataset, $feature, $element) {
        // Log::channel('stderr')->info('Feature: ' . $feature->name . ': ' . strval($element));
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
                $p = $feature_node->xpath($ns . ':' . $property->name);
                if (sizeof($p) > 0) {
                    $this->parseDatasetFeatureProperty($dataset_feature, $property, $p[0], $ns);
                }
            }
        }
    }

    private function parseDatasetFeatureProperty($dataset_feature, $property, $node, $ns, $parent_dataset_feature_property_id=0) {
        // Log::channel('stderr')->info('Property: ' . $property->name . ': ' . strval($node));
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
                $p = $node->xpath('.//' . $ns . ':' . $prop->name);
                if (sizeof($p) > 0) {
                    $this->parseDatasetFeatureProperty($dataset_feature, $prop, $p[0], $ns, $dataset_feature_property->id);
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
