ARG NGINX_VERSION=1.27.4

FROM nginx:${NGINX_VERSION}-alpine

COPY ./docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./dist/browser /usr/share/nginx/html
