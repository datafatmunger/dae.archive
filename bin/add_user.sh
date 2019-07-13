#!/bin/bash

echo 'ADD USER: ' + $1 $2 $3

useradd -m $1 -s /bin/bash
usermod --password $2 $1

sudo -u $1 -H sh -c "mkdir -p /home/$1/archive.git"

pushd /home/$1/archive.git
sudo -u $1 -H sh -c "git init --bare"
cp /root/post-receive /home/$1/archive.git/hooks/

sudo -u $1 -H sh -c "git config --global user.email \"$3\""
sudo -u $1 -H sh -c "git config --global user.name \"$1\""


