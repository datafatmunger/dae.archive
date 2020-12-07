FROM debian:latest
MAINTAINER JBG <jbg@hacker.coffee>

RUN apt-get update -y; \
  apt-get install -y curl build-essential git sudo openssh-server vim cron

RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -; \
  apt-get install -y nodejs

ADD dae-bin /usr/local/bin

ADD config.json /config.json

ADD sudoers /etc/sudoers

ADD dae-wiki /wiki

RUN cd /wiki/app && npm install && npm run deploy

RUN cd /wiki/public && npm install
