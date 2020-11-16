#!/bin/bash
echo "running install.sh"

NAME=$(grep NAME .env | xargs)
NAME=${NAME#*=}

PW=$(grep PW .env | xargs)
PW=${PW#*=}

git config -f .gitmodules submodule.dae-wiki.branch docker

git submodule init
git submodule update -f

mkdir -p dae-wiki/public/assets

if [ ! -d ./vols/wiki ]; then
    cd ./vols &&\
    git clone dae-wiki@andrefincato.info:content.git wiki &&\
        git checkout master &&\
    git config pull.rebase false
else
    cd ./vols/wiki && git checkout master && git pull --all
fi



echo "all done"

