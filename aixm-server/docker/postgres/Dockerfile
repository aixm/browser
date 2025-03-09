FROM postgres:15.1

ENV LC_ALL=en_US.UTF-8

# Backup
COPY ./docker/postgres/backup.sh /usr/bin/backup.sh
RUN chmod +x /usr/bin/backup.sh

WORKDIR /var/lib/postgresql/data
