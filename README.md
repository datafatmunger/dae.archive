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

