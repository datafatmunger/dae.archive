# The DAE archive

## Running the archive

### Build containers, start the containers

The containers will only build the first time. Subsequent ups will simply run them.

    $ docker-compose up

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

### init.sql

Inital sqlite3 database state.

### Lenna.png

Image used for testing imagemagick and tensorflow indexing.

### sudoers

Dropped into `/etc/sudoers` in the archive container. Allows users in the `sudo` group to `sudo`.

### test.pdf

Test pdf used to test indexing of PDFs.

