#!/bin/bash

set -o errexit
set -o nounset

# set kubectl defaults:
kubectl config set-context --current --namespace=archive-wiki
echo -e "\nkubectl defaults set!"

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

# provision ingress controller:
helm upgrade --install nginx-ingress charts/nginx-ingress --namespace archive-wiki --values charts/nginx-ingress/values.yaml
echo -e "\nnginx=ingress installed!"

# deploy ingress:
kubectl apply -f ingresses/archive.yaml
echo -e "\ningress created!"
