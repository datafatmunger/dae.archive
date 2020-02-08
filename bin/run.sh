#!/bin/bash

# Create jbg user, if doesn't exist - JBG
if [ ! -d /home/jbg ]; then
  /usr/local/bin/add_user.sh jbg password jbg@example.com
  usermod -aG sudo jbg
fi

# Init sshd, if needed - JBG
if [ ! -d /home/jbg ]; then
  /usr/bin/ssh-keygen -A
  mkdir -p /var/run/sshd
fi

# Start sshd - JBG
/usr/sbin/sshd

pushd /app

if [ ! -d node_modules ]; then
  npm install sqlite3 --build-from-source
  npm install
fi

# Start dae-api - JBG
npm start

