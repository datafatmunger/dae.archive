#!/bin/bash

# Deploy API - JBG
echo "Deploying API ..."
cp /archive/jbg/config.json /root
cp -r /archive/jbg/dae-api /root
pushd /root/dae-api
npm install
popd
echo "Done."

# Copy any new systemd service units - JBG
echo "Deploying new systemd units..."
cp -r /archive/jbg/systemd/* /etc/systemd/system
systemctl daemon-reload
echo "Done."

# Set a new Solr schema, incase there was an update. - JBG
echo "Setting new Solr schema..."
/usr/local/bin/reset_solr.sh
sleep 10s
echo "Done."

# Run the index
echo "Indexing for search..."
/usr/local/bin/index.sh
echo "Done."

