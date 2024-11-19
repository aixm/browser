ARG NGINX_VERSION=1.27.2

FROM nginx:$NGINX_VERSION

# config
ADD ./docker/nginx/default.conf /etc/nginx/conf.d/default.conf

# keys and certs
ADD ./docker/nginx/ssl/private/*.key /etc/ssl/private/
ADD ./docker/nginx/ssl/certs/*.crt /etc/ssl/certs/

WORKDIR /var/www
