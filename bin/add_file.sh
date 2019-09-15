#!/bin/bash

echo $1 $2 $3 $4

sudo -u $3 -H sh -c "git clone /home/$3/archive.git /tmp/archive.$3.tmp"
sudo -u $3 -H sh -c "cp \"$1\" \"/tmp/archive.$3.tmp/$2\""

pushd /tmp/archive.$3.tmp
sudo -u $3 -H sh -c "git add \"$2\""
sudo -u $3 -H sh -c "git commit -am \"$4\""
sudo -u $3 -H sh -c "git push origin master"
popd

sudo -u $3 -H sh -c "rm -rf /tmp/archive.$3.tmp"

