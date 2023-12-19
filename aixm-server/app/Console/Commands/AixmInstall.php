<?php

namespace App\Console\Commands;

use Illuminate\Support\Facades\Schema;
use Exception;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Artisan;

class AixmInstall extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'aixm:install';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
        $this->description = trans('console.aixm.install.description');
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $this->alert($this->description);
        try {

            if ($this->confirm(trans('console.aixm.install.confirm.key'), true)) {
                Artisan::call('key:generate', [], $this->getOutput());
            }

            if ($this->confirm(trans('console.aixm.install.confirm.link'), true)) {
                Artisan::call('storage:link', [], $this->getOutput());
            }
            $this->info(trans('console.aixm.install.info.database'));
            Artisan::call('migrate:fresh', ['--force' => true], $this->getOutput());
            Artisan::call('db:seed', ['--force' => true], $this->getOutput());

        } catch (Exception $ex) {
            $this->error($ex->getMessage());
        }
    }
}
