FROM debian:latest
MAINTAINER JBG <jbg@hacker.coffee>

RUN apt-get update -y; \
  apt-get install -y sqlite3 curl build-essential git sudo openssh-server python3-pip imagemagick vim cron poppler-utils

RUN pip3 install gitpython tensorflow

RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -; \
  apt-get install -y nodejs

ADD sudoers /etc/sudoers

