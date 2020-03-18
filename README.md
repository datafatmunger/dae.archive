# The DAE archive

## Start containers

    $ docker-compose up







# Old stuff ... 

## sshd tweaks

Changed the following `sshd_config` configs for security purposes.  Basically only allows user logins with ssh keys.

    ChallengeResponseAuthentication no
    PasswordAuthentication no
    UsePAM no
    PermitRootLogin no

## On machine user admin

### Creating a user

Create a user and set the shell to bash.

    \# useradd -m <USER_NAME> -s /bin/bash

Set a password for the user.

    \# usermod --password <PASSWORD> <USER_NAME>

### Deleting a user

Deletes a user, the home directory and force deletes unowned files.

    \# userdel -r -f <USER_NAME>

## Apache setup

### Install packages

    \# apt install apache2

### Enable relevant Apache modules

Allow directory/file lists and browsing.

    \# a2enmod autoindex

Allow ~\<USER\_NAME\> style url access.

    \# a2enmod userdir
    \# a2enmod proxy 
    \# a2enmod proxy_http 
    \# a2enmod headers

### Configure Apache

Allow /archive to be root directory.  Add the following to `/etc/apache2/apache2.conf`.

    <Directory /archive>
            Options Indexes FollowSymLinks
            AllowOverride None
            Require all granted
    </Directory>

Enable a proxy pass for the upstream node HTTP API server

    ProxyPass "/api" "http://localhost:8000"
    ProxyPassReverse "/api" "http://localhost:8000"

### Make `/archive` world readable.

    \# chmod -R 777 /archive

### Updates to `000-default.conf`

    \# nano /etc/apache2/sites-enabled/000-default.conf

Enable user dir `~<USER_NAME>`, add

    UserDir public_html

Set document root to `/archive`, change `DocumentRoot`

    DocumentRoot /archive

## Setup a user `git` flow

### Create user archive repository

    $ mkdir archive.git

    $ cd archive.git

    $ git init --bare

### Add post receive hook

Deploys a new archive on a `git push`.

    $ nano archive.git/hooks/post-receive

Add the following content to the `post-receive` file.

    #!/bin/bash
    echo "Hello hook ... $HOME"
    mkdir -p /archive/$USER
    git --work-tree=/archive/$USER --git-dir=$HOME/archive.git checkout -f
    echo "Done."

### Make `post-receive` executable.

    $ chmod +x post-receive

### Grab a local copy of repository

    $ git clone ssh://<USER_NAME>@80.100.106.160/home/<USER_NAME>/archive.git dae.archive

## API setup

### Download nodejs

    $ curl -sL https://deb.nodesource.com/setup_10.x -o nodesource_setup.sh

### Install nodejs repos

    $sudo bash nodesource_setup.sh

### Install packages

    $ sudo apt install nodejs npm sqlite3

### Create sqlite3 database

    $ sudo sqlite3 /data/dae.db

### Create tables

    create table Users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      name TEXT,
      hash TEXT,
      salt TEXT,
      CONSTRAINT email_unique UNIQUE (email)
    );

    create table Tokens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      name TEXT,
      token TEXT,
      series TEXT,
      FOREIGN KEY(user_id) REFERENCES Users(id),
      CONSTRAINT is_unique UNIQUE (user_id, name));

## Create systemd unit file

    $ sudo nano /etc/systemd/system/dae-api.service

## Add the content

    [Unit]
    Description=DAE API

    [Service]
    ExecStart=/usr/bin/node /root/dae-api/server.js

    [Install]
    WantedBy=multi-user.target

## Image Processing with ImageMagick!

## Make 'thumbs' subdirectory and convert images to thumbnails into that directory

    $ mogrify -path ./thumbs/ -resize 100x100 *

## Print the 5 most recurring pixels in an image (for searching / indexing)

    $ convert FILENAME -format %c -depth 8 histogram:info:- | sort -r | head -5


