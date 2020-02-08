#!/bin/bash

echo $1 $2 $3

sudo -u $2 -H sh -c "git clone /home/$2/archive.git /tmp/archive.$2.tmp"

pushd /tmp/archive.$2.tmp
sudo -u $2 -H sh -c "git rm \"$1\""
sudo -u $2 -H sh -c "git commit -am \"$3\""
sudo -u $2 -H sh -c "git push origin master"
popd

sudo -u $2 -H sh -c "rm -rf /tmp/archive.$2.tmp"

