# Azure Kubernetes hosting

This document describes how the Azure Kubernetes Service is configured to host the applications in this project.

## Design choices

### Containers

Before working on Azure hosting, the docker-compose.yml was already available for local development. Therefore it made sense to re-use the docker compose configuration for hosting.

Azure provides several services to host applications from containers:
* Container Instances
* Web App for Containers
* Kubernetes Service

The _Container Instances_ service is not meant to host clusters of containers, as defined in docker compose format. The _Web App for Containers_ service promises tight integration with _Azure Pipelines_. It can handle an actual docker-compose.yml as input, but it was unable to configure storage volumes in a fine-grained manner. There did not seem to be a way to control, or even describe, individual containers of the web app. Finally, the _Kubernetes Service_ enables us to host a group of containers, yet still allow fine-grained control over each of them.

### Storage

When running docker compose in local development environments, the local storage is used to map storage volumes. In Azure however, we need to select Azure storage account type storage to map to the containers. There is a simple way of specifying an Azure file share in a Kubernetes deployment. However, that method lacks control over the mount options of the volume. Sadly, the default mount options do not allow for symlinks to be created. The node processes rely on creating symlinks and are therefore incompatible with the default mount options. Luckily, there is another method of mapping the Azure storage to the Kubernetes cluster: persistent volumes. By configuring persistent volume objects in the Kubernetes cluster we can configure the mount options of the file shares. That way we can enable symlink support, and control default ownership and permissions.

## Instructions

### Basics

* set default subscription:
`az account set --subscription 016078a2-b058-43a8-b355-e81ea70882dd`

* set default location:
`az configure --defaults location=westeurope`

* create resource group:

```
az group create --resource-group archive-wiki
az configure --defaults group=archive-wiki
```

* create Storage Account:
`az storage account create --name hothns --access-tier hot --enable-hierarchical-namespace --sku Standard_GZRS`

* create ACR registry:

```
az acr create --name awimages --sku Standard
az configure --defaults acr=awimages
```

(ensure docker daemon is running, and client is available)

`az acr login`

* create AKS cluster:

```
az aks create --resource-group archive-wiki --name awcluster01 --attach-acr awimages --generate-ssh-keys --kubernetes-version 1.15.7 --load-balancer-sku standard --network-plugin azure --node-count 1 --node-vm-size Standard_A4_v2
az aks get-credentials --name awcluster01
kubectl create clusterrolebinding kubernetes-dashboard --clusterrole=cluster-admin --serviceaccount=kube-system:kubernetes-dashboard
```

* browse Kubernetes dashboard in web browser (ties up your terminal):
`az aks browse --name awcluster01`

* create file shares:
`for share in archive data home solr tmp; do az storage share create --account-name hothns --name "$share" --quota 1; done`

### Container images

* upload images to acr:

```
docker image tag daearchive_apache:latest awimages.azurecr.io/daearchive_apache:latest
docker image tag daearchive_solr:latest awimages.azurecr.io/daearchive_solr:latest
docker image tag daearchive_archive:latest awimages.azurecr.io/daearchive_archive:latest
docker push awimages.azurecr.io/daearchive_archive:latest
docker push awimages.azurecr.io/daearchive_solr:latest
docker push awimages.azurecr.io/daearchive_apache:latest
```

### Kubernetes

* create namespace for this project:
`kubectl create namespace archive-wiki`

* deploy persistent volumes:
`for pv in k8s/pervols/*yml; do kubectl apply -f "$pv"; done`

(consider sleeping for 1 minute)

* deploy persistent volume claims:
`for pvc in k8s/pervolclaims/*yml; do kubectl apply -f "$pvc"; done`

* prepare storage secret, read key from:
`az storage account keys list --account-name hothns`

```
account=$(echo -n "$storage_account_name" | base64)
key=$(echo -n "$storage_account_key" | base64)
```

(insert $account, $key into k8s/secrets/storage-secret.yaml)

* deploy storage secret:
`kubectl apply -f k8s/secrets/storage-secret.yaml`

* deploy services:
`for manifest in k8s/services/*yaml; do kubectl apply -f "$manifest"; done`

* apply deployments:
`for manifest in k8s/deployments/*.yaml; do kubectl apply -f "$manifest"; done`

#### Ingress

* install helm:
`curl https://raw.githubusercontent.com/kubernetes/helm/master/scripts/get-helm-3 | bash -o xtrace -`

* provision ingress controller:
`helm upgrade --install nginx-ingress k8s/charts/nginx-ingress --namespace archive-wiki --values k8s/charts/nginx-ingress/values.yaml`

* deploy ingress:
`kubectl apply -f k8s/ingresses/archive.yaml`

### Test applications

* connect to the solr pod, find the pods id:
`kubectl --namespace archive-wiki get pods`

* run a shell in the container:
`kubectl --namespace archive-wiki exec "$pod_name" -it -- /bin/bash`

(follow solr/create_cores.md, but skip the "docker exec solr" at the start of each command)

* test api:
(follow dae-api/README.md, but save the user deletion for last)
