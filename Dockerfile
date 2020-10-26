FROM php:7.4-fpm-alpine

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

RUN apk update && apk add --no-cache                     \
git                                                     \
npm                                                     \
unzip                                                   \
&& docker-php-ext-install                               \
pdo_mysql                                               \
&& git clone https://github.com/ksrnnb/librinet.git     \
&& cd librinet                                          \
&& composer install --no-dev                            \
&& cp .env.example .env                                 \
&& php artisan key:generate                             \
&& chmod -R 777 ./storage                               \
&& chmod -R 775 ./bootstrap/cache                       \
&& npm install -y cross-env                             \
&& npm run production                                   \
&& npm audit fix

WORKDIR /var/www/html/librinet