#!/usr/bin/make
# Makefile readme (en): <https://www.gnu.org/software/make/manual/html_node/index.html#SEC_Contents>
SHELL = /bin/sh

COM_COLOR   = \033[0;34m
OBJ_COLOR   = \033[0;36m
OK_COLOR    = \033[0;32m
ERROR_COLOR = \033[0;31m
WARN_COLOR  = \033[0;33m
NO_COLOR    = \033[m

docker_bin := $(shell command -v docker 2> /dev/null)

docker_compose_bin := $(docker_bin) compose

PACKAGE_VERSION := $(shell git describe --tags $$(git rev-list --tags --max-count=1))


--------------------: ## --------------------

CONTAINER_NAME1 := aixm-server
CONTAINER_NAME2 := aixm-nginx
CONTAINER_NAME3 := aixm-postgres

PREFIX := aixm

--------------------: ## --------------------

.DEFAULT_GOAL := help

.PHONY: help create create-no-cache create-php start start-dev stop up \
down dump-autoload install update

--------------------: ## --------------------K

help: ## Show this help
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

--------------------: ## --------------------


--------------------: ## ------------------------------
--------------------: ## *** BUILD CREATE ***
--------------------: ## ------------------------------
create: ## Create using cache
	$(docker_bin) build --rm --build-arg VERSION=$(PACKAGE_VERSION) -t $(PREFIX)/$(CONTAINER_NAME1):$(PACKAGE_VERSION) \
-t $(PREFIX)/$(CONTAINER_NAME1):latest -f ./docker/php-fpm/Dockerfile .
	$(docker_bin) build --rm --build-arg VERSION=$(PACKAGE_VERSION) -t $(PREFIX)/$(CONTAINER_NAME2):$(PACKAGE_VERSION) \
-t $(PREFIX)/$(CONTAINER_NAME2):latest -f ./docker/nginx/Dockerfile .
	$(docker_bin) build --rm --build-arg VERSION=$(PACKAGE_VERSION) -t $(PREFIX)/$(CONTAINER_NAME3):$(PACKAGE_VERSION) \
-t $(PREFIX)/$(CONTAINER_NAME3):latest -f ./docker/postgres/Dockerfile .

create-no-cache: ## Create without cache
	$(docker_bin) build --rm --no-cache --build-arg VERSION=$(PACKAGE_VERSION) -t $(PREFIX)/$(CONTAINER_NAME1):$(PACKAGE_VERSION) \
-t $(PREFIX)/$(CONTAINER_NAME1):latest ./docker/php-fpm/Dockerfile .
	$(docker_bin) build --rm --no-cache --build-arg VERSION=$(PACKAGE_VERSION) -t $(PREFIX)/$(CONTAINER_NAME2):$(PACKAGE_VERSION) \
-t $(PREFIX)/$(CONTAINER_NAME2):latest ./docker/nginx/Dockerfile .
	$(docker_bin) build --rm --no-cache --build-arg VERSION=$(PACKAGE_VERSION) -t $(PREFIX)/$(CONTAINER_NAME3):$(PACKAGE_VERSION) \
-t $(PREFIX)/$(CONTAINER_NAME3):latest ./docker/postgres/Dockerfile .

create-php: ## Create using cache (php only)
	$(docker_bin) build --rm --build-arg VERSION=$(PACKAGE_VERSION) -t $(PREFIX)/$(CONTAINER_NAME1):$(PACKAGE_VERSION) \
-t $(PREFIX)/$(CONTAINER_NAME1):latest -f ./docker/php-fpm/Dockerfile .

--------------------: ## ------------------------------
--------------------: ## *** START STOP ***
--------------------: ## ------------------------------
up: ## Create and Start
	$(docker_compose_bin) up --force-recreate --build

start: ## Start (source inside)
	$(docker_compose_bin) up -d

start-dev: ## Start (source on host)
	$(docker_compose_bin) up -d --force-recreate --build

stop: ## Stop all containers
	$(docker_compose_bin) stop

down: ## Stop and remove all images
	$(docker_compose_bin) down


--------------------: ## ------------------------------
--------------------: ## *** INSTALL UPDATE ***
--------------------: ## ------------------------------
dump-autoload: ## Composer dump-autoload
	$(docker_compose_bin) exec -T $(CONTAINER_NAME1) composer dump-autoload

install: ## Install aixm Application
	$(docker_compose_bin) exec -T $(CONTAINER_NAME1) composer install
	$(docker_compose_bin) exec $(CONTAINER_NAME1) php artisan aixm:install

update: dump-autoload ## Update aixm Application
	$(docker_compose_bin) exec $(CONTAINER_NAME1) php artisan aixm:update

backup-db: ## Backup DB
	@$(docker_bin)  exec -i -t  $(CONTAINER_NAME3) pg_dump -U aixm -Fc -b -v aixm -f "/tmp/data/aixm.backup"

restore-db: ## Backup DB
	@$(docker_bin)  exec -i -t  $(CONTAINER_NAME3) pg_restore -U aixm -d aixm --clean -v "/tmp/data/aixm.backup"

--------------------: ## ------------------------------
--------------------: ## *** ENTER CONTAINERS ***
--------------------: ## ------------------------------
enter: ## Enter aixm application container
	@$(docker_bin)  exec -i -t  $(CONTAINER_NAME1) /bin/bash
enter-db: ## Enter DB application container
	@$(docker_bin)  exec -i -t  $(CONTAINER_NAME3) psql -U aixm

--------------------: ## --------------------
--------------------: ## --------------------
--------------------: ## --------------------
