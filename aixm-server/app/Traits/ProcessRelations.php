<?php

namespace App\Traits;

use Symfony\Component\HttpFoundation\Request as RequestAlias;

trait ProcessRelations
{

    /**
     * @param string $relation_name
     * @param        $relation_data
     * @return void
     */
    public function processHasMany(string $relation_name, $relation_data)
    {
        if ($this->{$relation_name}()) {
            if ($relation_data) {
                $this->{$relation_name}()->delete();
                $className = get_class($this->{$relation_name}()->getRelated());
                $relations = [];
                foreach ($relation_data as $relation) {
                    $r = new $className();
                    $r->fill($relation);
                    $relations[] = $r;
                }
                $this->{$relation_name}()->saveMany($relations);
            }
            $this->load($relation_name);
        }
    }

    /**
     * @param string $pivot_name
     * @param        $pivot_data
     * @param string $method
     * @return void
     */
    public function processPivot(string $pivot_name, $pivot_data, string $method = RequestAlias::METHOD_PUT)
    {
        if ($this->{$pivot_name}()) {
            if ($pivot_data) {
                if (!is_array($pivot_data)) {
                    $pivot_data = json_decode($pivot_data, true);
                }
                $pivot_with_fields = array_diff($this->{$pivot_name}()->getPivotColumns(), ['created_at', 'updated_at']);
                if (sizeof($pivot_with_fields) > 0){
                    // sync additional fields
                    $pivot = [];
                    foreach ($pivot_data as $d) {
                        $fields = [];
                        foreach ($pivot_with_fields as $f){
                            $fields[$f] = $d[$f];
                        }
                        $pivot[$d['id']] = $fields;
                    }
                } else {
                    // sync id only
                    $pivot = collect($pivot_data)->pluck('id')->toArray();
                }
                switch ($method) {
                    case RequestAlias::METHOD_DELETE:
                        $this->{$pivot_name}()->detach();
                        break;
                    case RequestAlias::METHOD_PUT:
                        $this->{$pivot_name}()->sync($pivot);
                        break;
                    case RequestAlias::METHOD_POST:
                        $this->{$pivot_name}()->sync($pivot);
                        break;
                    default:
                        break;
                }
            } else {
                // no pivot data -> detach
                $this->{$pivot_name}()->detach();
            }
            $this->load($pivot_name);
        }
    }
}
