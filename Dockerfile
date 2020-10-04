FROM php:7.4-fpm-alpine

RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" \
&& php -r "if (hash_file('sha384', 'composer-setup.php') === '795f976fe0ebd8b75f26a6dd68f78fd3453ce79f32ecb33e7fd087d39bfeb978342fb73ac986cd4f54edd0dc902601dc') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;" \
&& php composer-setup.php                               \
&& php -r "unlink('composer-setup.php');"               \
&& mv composer.phar /usr/local/bin/composer             \
&& apk update && apk add                                \
git                                                     \
unzip                                                   \
&& docker-php-ext-install                               \
pdo_mysql                                               \
&& git clone https://github.com/ksrnnb/librinet.git     \
&& cd librinet                                          \
&& composer install --no-dev                            \
&& cp .env.example .env                                 \
&& php artisan key:generate                             \
&& chmod -R 777 ./storage                               \
&& chmod -R 775 ./bootstrap/cache
# unzip         to create laravel project
# pdo_mysql     to use MySQL on PHP

WORKDIR /var/www/html/librinet