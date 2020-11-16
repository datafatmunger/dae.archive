#!/bin/bash

# debug
set -o xtrace

# Configure user permissions for file uploads
chmod a+wt /archive /tmp

# Create jbg user, if doesn't exist - JBG
if [ ! -d /home/jbg ]; then
  /usr/local/bin/add_user.sh jbg password jbg@example.com
  usermod -aG sudo jbg
fi

# Create wiki user, if doesn't exist - JBG
if [ ! -d /home/wiki ]; then
  useradd -m wiki -s /bin/bash
  usermod --password $(openssl passwd -1 password) wiki 
fi

# Create jbg user, if doesn't exist - JBG
if [ ! -f /data/dae.db ]; then
  sqlite3 /data/dae.db < /init.sql
fi

# Init sshd, if needed - JBG
if [ ! -d /var/run/sshd ]; then
  /usr/bin/ssh-keygen -A
  mkdir -p /var/run/sshd
fi

# Start sshd - JBG
/usr/sbin/sshd

# Start dae-api - JBG
cd /app
npm start
