# sudo apt-get install openssl

# openssl req -x509 -nodes -days 365 -subj "/C=CA/ST=QC/O=Company, Inc./CN=aixm.com" -addext "subjectAltName=DNS:aixm.com" \
 -newkey rsa:2048 -keyout ./docker/nginx/ssl/private/nginx-selfsigned.key -out ./docker/nginx/ssl/certs/nginx-selfsigned.crt;
