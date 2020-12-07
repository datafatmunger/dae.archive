# The DAE archive

## Get submodules

    $ git submodule init

    $ git submodule update --recursive --remote

## Environment

You will need to to create a `.env` file for `dae-api`.  See `.env.sample` for fields.

For `dae.wiki`, copy the keys from `./dae-wiki/public/.env.example` over to `.env`, and fill them out correctly based on the instructions in `./dae-wiki/public/README.md`

## dae-wiki setup

- run `./dae-bin/dae-wiki-clean-up.sh`.
- populate `./dae-wiki/public/assets/fonts/` with fonts
- put the content of the master wiki folder into `./vols/wiki`

## Start containers

    $ docker-compose up

## Setup Solr

    $ docker-compose exec solr /opt/solr/bin/solr create -p 8983 -c dae -d /opt/solr/example/files/conf

    $ curl -X POST -H 'Content-type:application/json' --data-binary @solr/dae.json http://localhost:8983/solr/dae/schema


```
$ docker-compose exec solr /opt/solr/bin/solr create -p 8983 -c dae-wiki -d /opt/solr/example/files/conf

$ curl -X POST -H 'Content-type:application/json' --data-binary @solr/dae-wiki.json http://localhost:8983/solr/dae-wiki/schema
```

Lastly, index the whole wiki content to solr:

```
$ SOLRURI=<value from .env> WIKIPATH_IDX=<value from .env> node dae-wiki/public/solr-utils/sync-with-solr.js ./vols/wiki /
```
