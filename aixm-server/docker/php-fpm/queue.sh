#!/bin/bash
#

run_queue_default() {
  php artisan queue:work --tries=1 --queue=default
}

run_queue_second() {
  php artisan queue:work --tries=1 --queue=second
}

run_queue_default &
run_queue_second
