#!/bin/bash
set -e  

echo "Preparing Laravel application..."

mkdir -p /var/www/html/database
test -f /var/www/html/database/database.sqlite || touch /var/www/html/database/database.sqlite

test -f /var/www/html/.env || cp /var/www/html/.env.example /var/www/html/.env

php artisan key:generate --force

php artisan migrate --force
php artisan db:seed || true  

php artisan config:clear
php artisan cache:clear

echo "Starting Laravel server..."
exec php artisan serve --host=0.0.0.0 --port=8000
