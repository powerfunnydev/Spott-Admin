FROM ${appiness.docker.registry}/nginx:${appiness.docker.nginx.version}

MAINTAINER Appiness (didier.deschepper@appiness.mobi)

ADD /files/etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf
ADD /files/docroot /var/www/html

CMD ["nginx"]