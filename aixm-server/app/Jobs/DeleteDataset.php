<?php

namespace App\Jobs;

use App\Models\Aixm\Dataset;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class DeleteDataset implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $dataset;

    /**
     * Create a new job instance.
     */
    public function __construct(Dataset $dataset)
    {
        $this->dataset = $dataset;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $file_name = $this->dataset->getPathWithFileName();
        if (Storage::disk('private')->exists($file_name)) {
            Storage::disk('private')->delete($file_name);
        }
        $this->dataset->delete();
    }
}
