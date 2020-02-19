FROM debian:latest 
MAINTAINER JBG <jbg@hacker.coffee>

RUN apt-get update -y; \
  apt-get install -y apache2

RUN a2enmod autoindex; \
  a2enmod userdir; \
  a2enmod proxy; \ 
  a2enmod proxy_http; \
  a2enmod headers

ADD apache/apache2.conf /etc/apache2/apache2.conf

ADD apache/merged.conf /etc/apache2/sites-enabled/api_wiki_general.conf
