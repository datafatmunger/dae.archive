#!/bin/bash
echo "running install.sh"

git config -f .gitmodules submodule.dae-wiki.branch master

git submodule init
git submodule update --recursive --remote

mkdir -p dae-wiki/public/assets

rm dae-wiki/public/package-lock.json && rm dae-wiki/app/package-lock.json

echo "all done"

