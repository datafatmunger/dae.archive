# Create Solr cores

This document explains how to create the dae and dae-wiki Solr cores.

## Instructions

First, ensure the solr container is running (i.e. `docker-compose up`).

Note: in the following commands the Solr container's name is _solr_

### create cores

`docker exec solr /opt/solr/bin/solr create -p 8983 -c dae -d /opt/solr/example/files/conf/`
`docker exec solr /opt/solr/bin/solr create -p 8983 -c dae-wiki -d /opt/solr/example/files/conf/`

### configure schemas

`docker exec solr curl -X POST -H 'Content-type:application/json' --data-binary @/dae/dae.json http://localhost:8983/solr/dae/schema`
`docker exec solr curl -X POST -H 'Content-type:application/json' --data-binary @/dae/daewiki.json http://localhost:8983/solr/dae-wiki/schema`
