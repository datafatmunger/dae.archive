#!/bin/bash

echo $1 $2

cp -r /home/$1/archive.git /home/$2/$1.archive.git
rm /home/$2/$1.archive.git/hooks/post-receive
chown -R $2 /home/$2/$1.archive.git
chgrp -R $2 /home/$2/$1.archive.git
