#!/bin/bash
#

#######################################
# Laravel Scheduler
#######################################
run_scheduler() {
  while true
  do
    php artisan schedule:run --verbose --no-interaction
    sleep 60
  done
}

run_scheduler
