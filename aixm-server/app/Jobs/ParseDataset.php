<?php

namespace App\Jobs;

use App\Models\Aixm\Dataset;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ParseDataset implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $dataset;
    protected $validate;

    /**
     * Create a new job instance.
     */
    public function __construct(Dataset $dataset, bool $validate = false)
    {
        $this->dataset = $dataset;
        $this->validate = $validate;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $this->dataset->parse($this->validate);
    }
}
