<?php

namespace Database\Seeders;

use App\Models\Aixm\Feature;
use App\Models\Aixm\Property;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EventExtensionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Event extension features and objects
        Feature::create(['name'=>'Event', 'type'=>'feature', 'abbreviation'=>'EVT', 'prefix'=>'event', 'description'=>'Event Extension of the feature.']);
        Feature::create(['name'=>'AISProduct', 'type'=>'object', 'abbreviation'=>'APD', 'prefix'=>'event', 'description'=>'AIS Product (NOTAM, AIP Amendment, AIP Supplement, Data Set, etc.) that provide the event data.']);
        Feature::create(['name'=>'AISMessage', 'type'=>'object', 'abbreviation'=>'AMG', 'prefix'=>'event', 'description'=>'AIS Message general data (NOTAM, SNOWTAM, ASHTAM).']);
        Feature::create(['name'=>'NOTAM', 'type'=>'object', 'abbreviation'=>'NTM', 'prefix'=>'event', 'description'=>'NOTAM message fields in the AIXM encoding.']);
        Feature::create(['name'=>'SNOWTAM', 'type'=>'object', 'abbreviation'=>'STM', 'prefix'=>'event', 'description'=>'SNOWTAM message fields in the AIXM encoding.']);
        Feature::create(['name'=>'ASHTAM', 'type'=>'object', 'abbreviation'=>'HTM', 'prefix'=>'event', 'description'=>'ASHTAM message fields in the AIXM encoding.']);
        Feature::create(['name'=>'RunwayAssessment', 'type'=>'object', 'abbreviation'=>'RAT', 'prefix'=>'event', 'description'=>'Runway which was assessed in SNOWTAM.']);

        // Event extension features' properties
        $feature_id = Feature::getFeature('Event')?->id; Property::create(['feature_id'=>$feature_id, 'name' => 'name', 'is_identifying' => true]);
        Property::create(['feature_id'=>$feature_id, 'name' => 'designator', 'is_identifying' => true]);
        Property::create(['feature_id'=>$feature_id, 'name' => 'scenario', 'is_identifying' => true]);
        Property::create(['feature_id'=>$feature_id, 'name' => 'version']);
        Property::create(['feature_id'=>$feature_id, 'name' => 'estimatedValidity']);
        Property::create(['feature_id'=>$feature_id, 'name' => 'activity']);
        Property::create(['feature_id'=>$feature_id, 'name' => 'summary']);
        $ref_feature_id = Feature::getFeature('ContactInformation')?->id; Property::create(['feature_id'=>$feature_id, 'name' => 'contactInformation', 'ref_feature_id' => $ref_feature_id]);
        $ref_feature_id = Feature::getFeature('Unit')?->id; Property::create(['feature_id'=>$feature_id, 'name' => 'provider', 'ref_feature_id' => $ref_feature_id, 'is_xlink' => true]);
        $ref_feature_id = Feature::getFeature('Airspace')?->id; Property::create(['feature_id'=>$feature_id, 'name' => 'concernedAirspace', 'ref_feature_id' => $ref_feature_id, 'is_xlink' => true]);
        $ref_feature_id = Feature::getFeature('AirportHeliport')?->id; Property::create(['feature_id'=>$feature_id, 'name' => 'concernedAirportHeliport', 'ref_feature_id' => $ref_feature_id, 'is_xlink' => true]);
        $ref_feature_id = Feature::getFeature('Event')?->id; Property::create(['feature_id'=>$feature_id, 'name' => 'parentEvent', 'ref_feature_id' => $ref_feature_id, 'is_xlink' => true]);
        $ref_feature_id = Feature::getFeature('Event')?->id; Property::create(['feature_id'=>$feature_id, 'name' => 'causeEvent', 'ref_feature_id' => $ref_feature_id, 'is_xlink' => true]);
        $ref_feature_id = Feature::getFeature('NOTAM')?->id; Property::create(['feature_id'=>$feature_id, 'name' => 'notification', 'ref_feature_id' => $ref_feature_id]);
        $ref_feature_id = Feature::getFeature('SNOWTAM')?->id; Property::create(['feature_id'=>$feature_id, 'name' => 'notification', 'ref_feature_id' => $ref_feature_id]);
        $ref_feature_id = Feature::getFeature('ASHTAM')?->id; Property::create(['feature_id'=>$feature_id, 'name' => 'notification', 'ref_feature_id' => $ref_feature_id]);
        $ref_feature_id = Feature::getFeature('AISProduct')?->id; Property::create(['feature_id'=>$feature_id, 'name' => 'container', 'ref_feature_id' => $ref_feature_id]);
        $ref_feature_id = Feature::getFeature('Note')?->id; Property::create(['feature_id'=>$feature_id, 'name' => 'annotation', 'ref_feature_id' => $ref_feature_id]);

        // Event property for all features
        Property::create(['name' => 'theEvent', 'is_xlink' => true]);

        // Event extension objects' properties
        $feature_id = Feature::getFeature('AISProduct')?->id; Property::create(['feature_id'=>$feature_id, 'name' => 'effectiveEnd']);
        Property::create(['feature_id'=>$feature_id, 'name' => 'effectiveStart']);
        Property::create(['feature_id'=>$feature_id, 'name' => 'number']);
        Property::create(['feature_id'=>$feature_id, 'name' => 'publication']);
        Property::create(['feature_id'=>$feature_id, 'name' => 'series']);
        Property::create(['feature_id'=>$feature_id, 'name' => 'subjectAIRAC']);
        Property::create(['feature_id'=>$feature_id, 'name' => 'title']);
        Property::create(['feature_id'=>$feature_id, 'name' => 'type']);
        Property::create(['feature_id'=>$feature_id, 'name' => 'year']);
        $ref_feature_id = Feature::getFeature('Unit')?->id; Property::create(['feature_id'=>$feature_id, 'name' => 'publisher', 'ref_feature_id' => $ref_feature_id, 'is_xlink' => true]);
        $feature_id = Feature::getFeature('AISMessage')?->id; Property::create(['feature_id'=>$feature_id, 'name' => 'issued']);
        Property::create(['feature_id'=>$feature_id, 'name' => 'number']);
        Property::create(['feature_id'=>$feature_id, 'name' => 'processed']);
        Property::create(['feature_id'=>$feature_id, 'name' => 'series']);
        Property::create(['feature_id'=>$feature_id, 'name' => 'year']);
        $feature_id = Feature::getFeature('NOTAM')?->id; Property::create(['feature_id'=>$feature_id, 'name' => 'issued']);
        Property::create(['feature_id'=>$feature_id, 'name' => 'number']);
        Property::create(['feature_id'=>$feature_id, 'name' => 'processed']);
        Property::create(['feature_id'=>$feature_id, 'name' => 'series']);
        Property::create(['feature_id'=>$feature_id, 'name' => 'year']);
        Property::create(['feature_id'=>$feature_id, 'name' => 'affectedFIR']);
        Property::create(['feature_id'=>$feature_id, 'name' => 'coordinates']);
        Property::create(['feature_id'=>$feature_id, 'name' => 'effectiveEnd']);
        Property::create(['feature_id'=>$feature_id, 'name' => 'effectiveStart']);
        Property::create(['feature_id'=>$feature_id, 'name' => 'estimatedEnd']);
        Property::create(['feature_id'=>$feature_id, 'name' => 'location']);
        Property::create(['feature_id'=>$feature_id, 'name' => 'lowerLimit']);
        Property::create(['feature_id'=>$feature_id, 'name' => 'maximumFL']);
        Property::create(['feature_id'=>$feature_id, 'name' => 'minimumFL']);
        Property::create(['feature_id'=>$feature_id, 'name' => 'permanent']);
        Property::create(['feature_id'=>$feature_id, 'name' => 'purpose']);
        Property::create(['feature_id'=>$feature_id, 'name' => 'radius']);
        Property::create(['feature_id'=>$feature_id, 'name' => 'referredNumber']);
        Property::create(['feature_id'=>$feature_id, 'name' => 'referredSeries']);
        Property::create(['feature_id'=>$feature_id, 'name' => 'referredYear']);
        Property::create(['feature_id'=>$feature_id, 'name' => 'schedule']);
        Property::create(['feature_id'=>$feature_id, 'name' => 'scope']);
        Property::create(['feature_id'=>$feature_id, 'name' => 'selectionCode']);
        Property::create(['feature_id'=>$feature_id, 'name' => 'text']);
        Property::create(['feature_id'=>$feature_id, 'name' => 'traffic']);
        Property::create(['feature_id'=>$feature_id, 'name' => 'type']);
        Property::create(['feature_id'=>$feature_id, 'name' => 'upperLimit']);
        $feature_id = Feature::getFeature('SNOWTAM')?->id; Property::create(['feature_id'=>$feature_id, 'name' => 'issued']);
        Property::create(['feature_id'=>$feature_id, 'name' => 'number']);
        Property::create(['feature_id'=>$feature_id, 'name' => 'processed']);
        Property::create(['feature_id'=>$feature_id, 'name' => 'series']);
        Property::create(['feature_id'=>$feature_id, 'name' => 'year']);
        Property::create(['feature_id'=>$feature_id, 'name' => 'correction']);
        Property::create(['feature_id'=>$feature_id, 'name' => 'location']);
        Property::create(['feature_id'=>$feature_id, 'name' => 'situationalAwareness']);
        $ref_feature_id = Feature::getFeature('RunwayAssessment')?->id; Property::create(['feature_id'=>$feature_id, 'name' => 'runwayCondition', 'ref_feature_id' => $ref_feature_id]);
        $feature_id = Feature::getFeature('ASHTAM')?->id; Property::create(['feature_id'=>$feature_id, 'name' => 'issued']);
        Property::create(['feature_id'=>$feature_id, 'name' => 'number']);
        Property::create(['feature_id'=>$feature_id, 'name' => 'processed']);
        Property::create(['feature_id'=>$feature_id, 'name' => 'series']);
        Property::create(['feature_id'=>$feature_id, 'name' => 'year']);
        Property::create(['feature_id'=>$feature_id, 'name' => 'affectedAirspace']);
        Property::create(['feature_id'=>$feature_id, 'name' => 'affectedFIR']);
        Property::create(['feature_id'=>$feature_id, 'name' => 'affectedRoutes']);
        Property::create(['feature_id'=>$feature_id, 'name' => 'alertLevel']);
        Property::create(['feature_id'=>$feature_id, 'name' => 'ashCloud']);
        Property::create(['feature_id'=>$feature_id, 'name' => 'ashCloudEvolution']);
        Property::create(['feature_id'=>$feature_id, 'name' => 'correction']);
        Property::create(['feature_id'=>$feature_id, 'name' => 'firstEruption']);
        Property::create(['feature_id'=>$feature_id, 'name' => 'informationSource']);
        Property::create(['feature_id'=>$feature_id, 'name' => 'location']);
        Property::create(['feature_id'=>$feature_id, 'name' => 'remark']);
        Property::create(['feature_id'=>$feature_id, 'name' => 'volcano']);
        $feature_id = Feature::getFeature('RunwayAssessment')?->id; Property::create(['feature_id'=>$feature_id, 'name' => 'assessmentCompletion']);
        Property::create(['feature_id'=>$feature_id, 'name' => 'condition']);
        Property::create(['feature_id'=>$feature_id, 'name' => 'conditionCode']);
        Property::create(['feature_id'=>$feature_id, 'name' => 'depth']);
        Property::create(['feature_id'=>$feature_id, 'name' => 'percentage']);
        Property::create(['feature_id'=>$feature_id, 'name' => 'runwayDesignator']);
        Property::create(['feature_id'=>$feature_id, 'name' => 'section']);
        Property::create(['feature_id'=>$feature_id, 'name' => 'width']);

    }
}
