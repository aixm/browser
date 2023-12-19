FROM nginx

# config
ADD ./docker/nginx/default.conf /etc/nginx/conf.d/default.conf

# keys and certs
ADD ./docker/nginx/ssl/private/*.key /etc/ssl/private/
ADD ./docker/nginx/ssl/certs/*.crt /etc/ssl/certs/

WORKDIR /var/www
