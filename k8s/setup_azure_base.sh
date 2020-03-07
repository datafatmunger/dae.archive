#!/bin/bash

set -o errexit
set -o nounset

# set azure-cli defaults:
az account set --subscription 016078a2-b058-43a8-b355-e81ea70882dd
az configure --defaults location=westeurope
echo -e "\nazure-cli defaults set!"

# create resource group, add to defaults:
az group create --resource-group archive-wiki
az configure --defaults group=archive-wiki
echo -e "\nresource group created!"

# create Storage Account:
az storage account create --name hothns --access-tier hot --enable-hierarchical-namespace --sku Standard_GZRS
echo -e "\nstorage account created!"

# create ACR registry, add to defaults:
az acr create --name awimages --sku Standard
az configure --defaults acr=awimages
echo -e "\ncontainer registry created!"

# create AKS cluster:
az aks create --resource-group archive-wiki --name awcluster01 --attach-acr awimages --generate-ssh-keys --kubernetes-version 1.15.7 --load-balancer-sku standard --network-plugin azure --node-count 1 --node-vm-size Standard_B2s
az aks get-credentials --name awcluster01
kubectl create clusterrolebinding kubernetes-dashboard --clusterrole=cluster-admin --serviceaccount=kube-system:kubernetes-dashboard
echo -e "\nKubernetes cluster created!"

# create file shares:
for share in archive data solr tmp
do
  az storage share create --account-name hothns --name "$share" --quota 1
done
echo -e "\nfile shares created!"
