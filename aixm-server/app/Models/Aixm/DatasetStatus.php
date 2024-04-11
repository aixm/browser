<?php

namespace App\Models\Aixm;

use App\Models\AixmGraphModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DatasetStatus extends AixmGraphModel
{
    ##################################################################################
    # Relations
    ##################################################################################
    public function dataset()
    {
        return $this->belongsTo(Dataset::class);
    }


    ##################################################################################
    # Functions
    ##################################################################################
}
