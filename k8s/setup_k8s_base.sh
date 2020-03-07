#!/bin/bash

set -o errexit
set -o nounset

# set azure-cli defaults:
az account set --subscription 016078a2-b058-43a8-b355-e81ea70882dd
az configure --defaults acr=awimages group=archive-wiki location=westeurope
echo -e "\nazure-cli defaults set!"

# create namespace, set as default:
kubectl create namespace archive-wiki
kubectl config set-context --current --namespace=archive-wiki
echo -e "\nnamespace created!"

# deploy persistent volumes:
for pv in pervols/*yml
do
  kubectl apply -f "$pv"
done
echo -e "\npersistent volumes created!"

# wait for persistent volumes
echo -e "\nwaiting 1 minute for volumes to be initialized.."
sleep 1m

# deploy persistent volume claims:
for pvc in pervolclaims/*yml
do
  kubectl apply -f "$pvc"
done
echo -e "\npersistent volume claims created!"

# deploy storage secret:
account="$(echo -n hothns | base64 --wrap=0)"
key="$(az storage account keys list --account-name hothns --query "([].value)[0]" --output tsv | tr --delete "\n" | base64 --wrap=0)"
sed --expression="s@\$base64-encoded_account_name@$account@" --expression="s@\$base64-encoded_account_key@$key@" --in-place secrets/storage-secret.yaml
kubectl apply -f secrets/storage-secret.yaml
echo -e "\nstorage secret created!"

# deploy services:
for manifest in services/*yaml
do
  kubectl apply -f "$manifest"
done
echo -e "\nservices created!"

# apply deployments:
for manifest in deployments/*.yaml
do
  kubectl apply -f "$manifest"
done
echo -e "\ndeployments created!"
