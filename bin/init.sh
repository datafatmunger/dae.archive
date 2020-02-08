#!/bin/bash

/usr/bin/ssh-keygen -A
mkdir -p /var/run/sshd

/usr/local/bin/add_user.sh jbg password jbg@example.com

usermod -aG sudo jbg
