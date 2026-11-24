FROM node:24-bookworm-slim AS frontend

WORKDIR /build
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM php:8.4-apache-bookworm

RUN apt-get update \
    && apt-get install -y --no-install-recommends libpq-dev libzip-dev supervisor unzip \
    && docker-php-ext-install pdo_pgsql zip pcntl \
    && rm -rf /var/lib/apt/lists/* \
    && a2enmod rewrite \
    && sed -i 's/^Listen 80$/Listen 10000/' /etc/apache2/ports.conf

COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer
COPY docker/production/apache.conf /etc/apache2/sites-available/000-default.conf
COPY docker/production/supervisord.conf /etc/supervisor/supervisord.conf
COPY --chmod=755 docker/production/start.sh /usr/local/bin/blockboard-start

WORKDIR /var/www/backend
COPY backend/ ./
COPY --from=frontend /build/dist/ public/
RUN mkdir -p storage/app/private storage/framework/cache/data storage/framework/sessions storage/framework/views storage/logs bootstrap/cache \
    && COMPOSER_ALLOW_SUPERUSER=1 composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader \
    && chown -R www-data:www-data storage bootstrap/cache

ENV APP_ENV=production APP_DEBUG=false LOG_CHANNEL=stderr
RUN printf 'upload_max_filesize=10M\npost_max_size=55M\n' > /usr/local/etc/php/conf.d/uploads.ini

EXPOSE 10000
CMD ["/usr/local/bin/blockboard-start"]
