#!/bin/bash

docker-compose down
docker rmi daearchive_archive
docker rmi daearchive_apache
sudo rm -rf vols/home/*
sudo rm -rf vols/data/*
sudo rm -rf dae-api/node_modules 
ssh-keygen -R "[localhost]:2222"
