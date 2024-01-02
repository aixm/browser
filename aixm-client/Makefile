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

CONTAINER_NAME := aixm-client

PREFIX := aixm

--------------------: ## --------------------

.DEFAULT_GOAL := help

.PHONY: help create create-no-cache run

--------------------: ## --------------------

help: ## Show this help
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

--------------------: ## --------------------


--------------------: ## ------------------------------
--------------------: ## *** BUILD CREATE RUN ***
--------------------: ## ------------------------------

create: ## Create using cache
	@npm run build
	$(docker_bin) build --rm --build-arg VERSION=$(PACKAGE_VERSION) -t $(PREFIX)/$(CONTAINER_NAME):$(PACKAGE_VERSION) \
-t $(PREFIX)/$(CONTAINER_NAME):latest -f ./docker/nginx/Dockerfile .

create-no-cache: ## Create without cache
	$(docker_bin) build --rm --no-cache --build-arg VERSION=$(PACKAGE_VERSION) -t $(PREFIX)/$(CONTAINER_NAME):$(PACKAGE_VERSION) \
-t $(PREFIX)/$(CONTAINER_NAME):latest -f ./docker/nginx/Dockerfile .

run: ## Run container from image
	$(docker_bin) run -d --name $(CONTAINER_NAME) -p 80:80 $(PREFIX)/$(CONTAINER_NAME):latest

--------------------: ## --------------------
--------------------: ## --------------------
--------------------: ## --------------------
