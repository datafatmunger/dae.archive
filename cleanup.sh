#!/bin/bash

docker-compose down
docker rmi daearchive_archive
docker rmi daearchive_apache
rm -rf vols/home/*
rm -rf vols/data/*
