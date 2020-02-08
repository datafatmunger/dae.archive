#!/bin/bash

#su -c "/opt/solr/bin/solr delete -p 8983 -c dae" solr
#su -c "/opt/solr/bin/solr create -p 8983 -c dae -d /opt/solr/example/files/conf/" solr

/opt/solr/bin/solr delete -p 8983 -c dae
/opt/solr/bin/solr create -p 8983 -c dae -d /conf/

curl -X POST -H 'Content-type:application/json' --data-binary @/dae/dae.json http://localhost:8983/solr/dae/schema

#service solr restart
