#!/bin/bash

docker-compose down
docker rmi daearchive_apps
docker rmi daearchive_solr
docker rmi daearchive_apache
docker volume rm daearchive_solr
sudo rm -rf vols/home/*
sudo rm -rf vols/data/*
sudo rm -rf vols/tmp/*
sudo rm -rf vols/archive/*
sudo rm -rf vols/solr/*
sudo rm -rf dae-api/node_modules 
ssh-keygen -R "[localhost]:2222"
