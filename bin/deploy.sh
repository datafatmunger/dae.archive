#!/bin/bash

# Deploy API - JBG
echo "Deploying API ..."
cp -r /archive/jbg/dae-api /root/dae-api
pushd /root/dae-api
npm install
popd
echo "Done."

# Copy any new systemd service units - JBG
echo "Deploying new systemd units..."
cp -r /archive/jbg/systemd/* /etc/systemd/system
echo "Done."

# Set a new Solr schema, incase there was an update. - JBG
echo "Setting new Solr schema..."
/usr/local/bin/reset_solr.sh
echo "Done."

