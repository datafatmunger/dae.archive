# The DAE archive

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

### Configure Apache

Allow /archive to be root directory.  Add the following to `/etc/apache2/apache2.conf`.

    <Directory /archive>
            Options Indexes FollowSymLinks
            AllowOverride None
            Require all granted
    </Directory>

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







