# The DAE archive

## Get submodules

    $ git submodule init

    $ git submodule update --recursive --remote

## Environment

You will need to to create a `.env` file for `dae-api`.  See `.env.sample` for fields.

## Start containers

    $ docker-compose up

## Setup Solr

    $ docker-compose exec solr /opt/solr/bin/solr create -p 8983 -c dae -d /opt/solr/example/files/conf

    $ curl -X POST -H 'Content-type:application/json' --data-binary @solr/dae.json http://localhost:8983/solr/dae/schema

