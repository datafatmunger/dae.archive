# The DAE archive

## Get submodules

    $ git submodule update --recursive --remote


## Start containers

    $ docker-compose up

## Setup Solr

    $ docker-compose exec solr /opt/solr/bin/solr create -p 8983 -c dae -d /opt/solr/example/files/conf

    $ curl -X POST -H 'Content-type:application/json' --data-binary @solr/dae.json http://localhost:8983/solr/dae/schema

