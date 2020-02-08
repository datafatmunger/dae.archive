#!/bin/bash

init.sh
/usr/sbin/sshd

pushd /app
npm start
