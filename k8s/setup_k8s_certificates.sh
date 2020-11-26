#!/bin/bash

set -o errexit
set -o nounset

# set kubectl defaults:
kubectl config set-context --current --namespace=archive-wiki
echo -e "\nkubectl defaults set!"

# provision cert-manager's custom k8s resources:
kubectl apply -f resources/00-crds.yaml
echo -e "\ncustom k8s resources created!"

# create namespace for cert-manager:
kubectl create namespace cert-manager
echo -e "\nnamespace created!"

# install helm, if absent:
if ! (which helm)
then
  cmd="curl https://raw.githubusercontent.com/kubernetes/helm/master/scripts/get-helm-3 | bash -o xtrace -"
  echo -e "\ninstalling helm.."
  echo "run \`$cmd\` ?"
  read -p "press Enter to continue, Ctrl+c to abort"
  $cmd
  echo -e "\nhelm installed!"
fi

# provision cert-manager:
helm upgrade --install cert-manager jetstack/cert-manager --namespace cert-manager --version v0.13.1
echo -e "\ncert-manager installed!"

# create le-staging issuer:
kubectl apply -f resources/issuer-staging.yml
echo -e "\nLet's Encrypt staging issuer created!"

# create le-production issuer:
kubectl apply -f resources/issuer-production.yml
echo -e "\nLet's Encrypt production issuer created!"
