# DAE Solr Archive Search

Apache Solr has been installed to provide a mechanism for executing searches across the archive.

## Solr Setup

Solr need `lsof` to check if it's running or not.

    $ apt-get install lsof

You'll need java as well.

    $ apt-get install default-jdk

### Download

    $ wget https://www-eu.apache.org/dist/lucene/solr/8.2.0/solr-8.2.0.tgz

### Install

    $ tar -zxvf solr-8.2.0.tgz solr-8.2.0/bin/install_solr_service.sh --strip 2

    $ bash ./install_solr_service.sh solr-8.2.0.tgz

### Create a Solr core

This step will initialize a core called `dae` with some of the default field types available in Solr.

    $ su -c "/opt/solr/bin/solr create -p 8983 -c dae -d /opt/solr/example/files/conf/" solr 

### Set the schema for the Solr core.  This is a custom schema specifically for searching the archive.

    $ curl -X POST -H 'Content-type:application/json' --data-binary @dae.json http://localhost:8983/solr/dae/schema

## Examples of queries

### Insert a record as follows.

    $ curl -d '[{"date": "1972-05-20T17:33:18Z", "name": "foo.bar", "path": "/bar/baz", "user": "foo", "tags": ["foo", "bar", "baz"]}]' http://localhost:8983/solr/dae/update

### Search

    $ curl http://localhost:8983/solr/dae/query?q=*:*

