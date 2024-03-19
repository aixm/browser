#!/bin/bash
#

# to use use with cron add on host:
# 0 3 * * * docker exec -it aixm-postgres /usr/bin/backup.sh aixm -U aixm

if [[ -z "$1" ]]; then
    echo "Usage: $0 <db_name> [pg_dump args]"
    exit 1
fi

DB="$1"; shift
DUMP_ARGS=$@
DIR="/tmp/data/backups/$DB"

KEEP_DAILY=7
KEEP_WEEKLY=5
KEEP_MONTHLY=12

function rotate {
    rotation=$1
    fdate=`date +%Y-%m-%d -d $date`
    file=$DIR/daily/*$fdate*.gz
    mkdir -p $DIR/$rotation/ || abort
    if [ -f $file ]; then
        cp $file $DIR/$rotation/ || abort
    else
        echo
    fi
}

function prune {
    dir=$DIR/$1
    keep=$2
    ls $dir | sort -rn | awk " NR > $keep" | while read f; do rm $dir/$f; done
}

function abort {
    echo "aborting..."
    exit 1
}

mkdir -p $DIR/daily || abort
mkdir -p $DIR/weekly || abort
mkdir -p $DIR/monthly || abort
mkdir -p $DIR/yearly || abort

date=`date +%Y-%m-%d` || abort
day=`date -d $date +%d` || abort
weekday=`date -d $date +%w` || abort
month=`date -d $date +%m` || abort

# Daily backup
/usr/bin/pg_dump $DB $DUMP_ARGS | gzip > $DIR/daily/${DB}_$date.sql.gz
test ${PIPESTATUS[0]} -eq 0 || abort

# Rotate
if [[ "$weekday" == "0" ]]; then
    rotate weekly
fi
if [[ "$day" == "01" ]]; then
    rotate monthly
fi
if [[ "$month/$day" == "01/01" ]]; then
    rotate yearly
fi

prune daily $KEEP_DAILY
prune weekly $KEEP_WEEKLY
prune monthly $KEEP_MONTHLY
