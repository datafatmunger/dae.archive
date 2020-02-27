FROM solr:latest

ADD bin /dae

ADD solr/conf /conf

ADD solr/dae.json /dae/dae.json

ADD solr/daewiki.json /dae/daewiki.json
