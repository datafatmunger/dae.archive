#!/bin/bash

# debug
set -o xtrace

# Create wiki user, if doesn't exist - JBG
if [ ! -d /home/wiki ]; then
  useradd -m wiki -s /bin/bash
  usermod --password $(openssl passwd -1 password) wiki 
fi

# Init sshd, if needed - JBG
if [ ! -d /var/run/sshd ]; then
  /usr/bin/ssh-keygen -A
  mkdir -p /var/run/sshd
fi

# Start sshd - JBG
/usr/sbin/sshd

# start dae-wiki backend
node /wiki/public/server.js /home/wiki/wiki 5000
