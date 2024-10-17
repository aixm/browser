FROM php:8.2-fpm

RUN apt-get update && apt-get install -y \
       git \
       wget \
	   nano \
	   unzip \
	   zlib1g-dev \
       libzip-dev \
	   libpq-dev \
	   libmcrypt-dev \
	   libmagickwand-dev --no-install-recommends \
	   libpng-dev \
	   libjpeg62-turbo-dev \
	   libfreetype6-dev \
    && pecl update-channels \
    && pecl install imagick \
    && docker-php-ext-enable imagick \
    && docker-php-ext-install zip \
	&& docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd \
    && docker-php-ext-install bcmath

# Opcache
RUN docker-php-ext-configure opcache --enable-opcache \
    && docker-php-ext-install opcache

# Docker PostgreSQL
RUN docker-php-ext-configure pgsql -with-pgsql=/usr/local/pgsql \
    && docker-php-ext-install pdo \
	   pdo_pgsql \
	   pgsql

# Docker REDIS
RUN pecl install -o -f redis \
    &&  rm -rf /tmp/pear \
    &&  docker-php-ext-enable redis

# Enable Sockets
RUN docker-php-ext-install sockets

# PHP ini
ADD ./docker/php-fpm/php.ini /usr/local/etc/php/php.ini

# www conf
ADD ./docker/php-fpm/www-custom.conf /usr/local/etc/php-fpm.d/www-custom.conf

# sources
COPY . /var/www

# Scheduler
COPY ./docker/php-fpm/scheduler.sh /opt/bin/scheduler.sh
RUN chmod +x /opt/bin/scheduler.sh

# Queue
COPY ./docker/php-fpm/queue.sh /opt/bin/queue.sh
RUN chmod +x /opt/bin/queue.sh

# Composer
ENV COMPOSER_ALLOW_SUPERUSER 1
ENV COMPOSER_HOME /tmp
RUN wget https://getcomposer.org/installer -O - -q \
    | php -- --install-dir=/bin --filename=composer --quiet
WORKDIR /var/www

# Install composer if not debug
RUN composer install --no-dev

# Set owner and rights to folder
RUN chown -R www-data:www-data /var/www
RUN chmod -R 777 /var/www/storage

CMD ["php-fpm"]

