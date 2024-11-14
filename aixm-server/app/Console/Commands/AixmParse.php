<?php

namespace App\Console\Commands;

use App\Models\Aixm\Dataset;
use Exception;
use Illuminate\Console\Command;
use Illuminate\Contracts\Console\PromptsForMissingInput;
use Illuminate\Database\Seeder;
use Illuminate\Http\Testing\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AixmParse extends Command implements PromptsForMissingInput
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'aixm:parse {file} {description=\'\'} {--validate}';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
        $this->description = trans('console.aixm.parse.description');
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $this->alert($this->description);
        $file_name = Dataset::$XmlFilesFolder . DIRECTORY_SEPARATOR . $this->argument('file');
        if (Storage::disk('private')->exists($file_name)) {
            $name = Str::afterLast($file_name, DIRECTORY_SEPARATOR);
            $path =  Str::beforeLast($this->argument('file'), DIRECTORY_SEPARATOR);
            $dataset = Dataset::create([
                'name' => Str::beforeLast($name, '.'),
                'filename' => $name,
                'content_type' => 'application/xml',
                'path' => $path,
                'description' => $this->argument('description')
            ]);
            $dataset->parse($this->option('validate'));
        } else {
            $this->error(trans('console.aixm.parse.error.file_not_exists'));
            return;
        }
        $this->info(trans('console.aixm.parse.info.done'));
    }

    /**
     * Prompt for missing input arguments using the returned questions.
     *
     * @return array
     */
    protected function promptForMissingArgumentsUsing()
    {
        return [
            'file' => [trans('console.aixm.parse.input.file.prompt'), trans('console.aixm.parse.input.file.example')],
        ];
    }
}
