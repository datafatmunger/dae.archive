FROM debian:latest
MAINTAINER JBG <jbg@hacker.coffee>

RUN apt-get update -y; \
  apt-get install -y sqlite3 curl build-essential git sudo openssh-server

RUN curl -sL https://deb.nodesource.com/setup_13.x | bash -; \
  apt-get install -y nodejs

ADD sudoers /etc/sudoers
