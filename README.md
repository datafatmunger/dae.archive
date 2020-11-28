# The DAE archive

## dae.wiki install

Before building the containers, install the dae-wiki repo by running `./install.sh`. This script clones the git repos and completes installation that is necessary before building docker containers. 

- move `./dae-wiki/public/.env.example` to the docker root folder, rename it `.env`, and fill it out correctly; there’s instructions in `./dae-wiki/public/README.md`
- populate `./dae-wiki/public/assets/fonts/` with fonts
- put the content of the master wiki folder into `./vols/wiki`

After this, you can do `docker-compose build`.

Lastly, index the whole wiki content to solr:

```
SOLRURI=<value from .env> WIKIPATH_IDX=<value from .env> node dae-wiki/public/solr-utils/sync-with-solr.js ./vols/wiki /
```

## Start containers

    $ docker-compose up

# Old stuff ... 

### Check out the repository, and submodules

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
    \# a2enmod userdir
    \# a2enmod proxy 
    \# a2enmod proxy_http 
    \# a2enmod headers

## Additional one-time setup stuff 

### Deploy this archive

Since this archive contains dae-app and the index overlays, a `jbg` user was initialized and ready to receive this repository.

    $ git remote add archive ssh://jbg@localhost:2222/~jbg/archive.git 

    $ git push archive master

### Create the Apache Solr core

    $ docker-compose exec solr bash

    $ /dae/reset_solr.sh

### Setup the nightly index process

    $ docker-compose exec archive bash

    $ crontab -e

Add the line:

    5 2 * * * /usr/local/bin/index.sh

## Nitty gritty details (for makers and hackers)

Each folder contains a README.

### docker-compose.yml

Defines the containers, in this case 3 different containers, for the Debian based archive, Apache webserver, and Apache Solr (searching).

### cleanup.sh

This is a helper script used during development to shread composed containers and artifacts between builds to test setup.

### config.json

Contains environment specific variables used by dae-api.

## Image Processing with ImageMagick!

### Lenna.png

Image used for testing imagemagick and tensorflow indexing.

## MongoDB

    $ wget -qO - https://www.mongodb.org/static/pgp/server-4.2.asc | sudo apt-key add -

    $ echo "deb http://repo.mongodb.org/apt/debian buster/mongodb-org/4.2 main" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.2.list

    $ sudo apt-get update

    $ sudo apt-get install -y mongodb-org

### sudoers

Dropped into `/etc/sudoers` in the archive container. Allows users in the `sudo` group to `sudo`.

### test.pdf

Test pdf used to test indexing of PDFs.


