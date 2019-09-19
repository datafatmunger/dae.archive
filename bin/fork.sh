#!/bin/bash

echo $1 $2

cp -r /home/$1/archive.git /home/$2/$1.archive.git
chown -R $2 /home/$2/$1.archive.git
chgrp -R $2 /home/$2/$1.archive.git
