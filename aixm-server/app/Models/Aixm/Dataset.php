<?php

namespace App\Models\Aixm;

use App\Models\AixmGraphModel;
use App\Models\Auth\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use XMLReader;
use SimpleXMLElement;

class Dataset extends AixmGraphModel
{
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

        $dataset_features = [];
        $cnt = 0;

        // reach first feature
        while($reader->read() && $reader->localName != $this->featureParentTagName){;}
        // loop features
        while($reader->localName == $this->featureParentTagName){
            $element = new SimpleXMLElement($reader->readInnerXml());
            $name = $element->getName();
            $feature = Feature::getFeature($name);
            if ($feature?->type === 'feature') {
                // Log::channel('stderr')->info('Read feature: ' . $name);
                // save properties
                $dataset_feature = new DatasetFeature();
                $dataset_feature->fill([
                    'feature_id' => $feature->id,
                    'gml_id_value' => strval($element->attributes('gml', true)->id),
                    'gml_identifier_value' => strval($element->xpath('gml:identifier')[0])
                ]);
                // $dataset_features[] = $dataset_feature;
                $this->dataset_features()->saveMany([$dataset_feature]);

                $ns = array_keys($element->getNameSpaces())[0];
                $timeSlices = $element->xpath( $ns . ':timeSlice/'. $ns . ':' . $name . 'TimeSlice');
                if (sizeof($timeSlices) > 0) {
                    // save properties
                    $dataset_feature_properties = [];
                    foreach ($feature->properties as $property) {
                        // TODO save all properties?
                       // if ($property->is_identifying) {
                            $p = $timeSlices[0]->xpath($ns . ':' . $property->name);
                            if (sizeof($p) > 0) {
                                // Log::channel('stderr')->info('Property: ' . $property->name . ': ' . strval($p[0]));
                                $dataset_feature_property = new DatasetFeatureProperty();
                                $value = strval($p[0]);
                                $xlink_href = '';
                                $xlink_href_type = '';
                                if ($property->is_xlink) {
                                    $xlink = strval($p[0]->attributes('xlink', true)->href);
                                    $xlink_arr = preg_split('/[:.]+/', $xlink);
                                    $xlink_href = array_pop($xlink_arr);
                                    $xlink_href_type = str_replace($xlink_href, '', $xlink);
                                }
                                $dataset_feature_property->fill([
                                    'property_id' => $property->id,
                                    'value' => $value,
                                    'xlink_href_type' => $xlink_href_type,
                                    'xlink_href' => $xlink_href
                                ]);
                                $dataset_feature_properties[] = $dataset_feature_property;
                            }
                        //}
                    }
                    $dataset_feature->dataset_feature_properties()->saveMany($dataset_feature_properties);
                }
                $cnt++;
            }
            $reader->next('hasMember');
            unset($element);
        }
        $reader->close();
        Log::channel('stderr')->info('Parsed ' . $cnt . ' features in ' . intval(round(1000 * (microtime(true) - $start))) . ' ms');

    }

    private function parseFeatureChildren($xml, $parent) {
        $reader = new XMLReader();
        $reader->xml($xml);
        $reader->read();
        // Log::channel('stderr')->info('Inner XML: ' . $xml);
        while ($reader->read()) {
            if ($reader->nodeType == XMLReader::ELEMENT) {
                $feature = Feature::getFeature($reader->localName);
                if ($feature?->type === 'feature') {
                    //$parent .= ' -> ' . $reader->localName;
                    Log::channel('stderr')->info('Read feature children: ' . $parent . ' -> ' . $reader->localName);
                    $this->parseFeatureChildren($reader->readOuterXml(), $parent . ' -> ' . $reader->localName);
                } else {
                    //Log::channel('stderr')->info('Read children: ' . $reader->localName);
                }
            }
        }
    }


    private function parseFeatureChildren2(XMLReader $reader, $parent) {
        $reader->read();
        while ($reader->read()) {
            if ($reader->nodeType == XMLReader::ELEMENT) {
                $feature = Feature::getFeature($reader->localName);
                if ($feature?->type === 'feature') {
                    //$parent .= ' -> ' . $reader->localName;
                    Log::channel('stderr')->info('Read feature: ' . $parent . ' -> ' . $reader->localName);
                    $this->parseFeatureChildren($reader, $parent . ' -> ' . $reader->localName);
                    //$dataset_feature = new DatasetFeature();
                    //$dataset_feature->fill(['feature_id' => $feature->id]);
                    //$dataset_features[] = $dataset_feature;
                }
            }
        }
    }
}
