#!/bin/sh
set -eu

: "${APP_KEY:?Set APP_KEY before starting Block Board}"

mkdir -p storage/app/private
chown www-data:www-data storage/app/private
runuser -u www-data -- php artisan migrate --force

exec supervisord -n -c /etc/supervisor/supervisord.conf
