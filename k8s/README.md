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

When running docker compose in local development environments, the local storage is used to map storage volumes. In Azure however, we need to select _Azure storage account_ type storage to map to the containers.

There is a simple way of specifying an _Azure Files_ share in a Kubernetes deployment. However, that method lacks control over the mount options of the volume. Sadly, the default mount options do not allow for symlinks to be created. Luckily, there is another method of mapping file shares to the Kubernetes cluster: persistent volumes. By configuring persistent volume objects in the Kubernetes cluster we can configure the mount options of the file shares. That way we can enable symlink support, and control (hardcoded) ownership and permissions.

But if we desire full unix filesystem capabilities, without hardcoded ownership and permissions, we must use _Azure Disks_ storage. Using such storage comes with a few constraints. Disks are only available in the _Premium Storage_ tier. To use premium storage in AKS we require a Kubernetes node of a select set of VM sizes. Not every VM size supports premium storage use. Another limitation of using premium storage is reflected in the storage replication options: only locally redundant storage (LRS) is available. And finally, _Azure Disks_ volumes can only be accessed by one pod at a time, while _Azure Files_ volumes can be shared across multiple pods.

## Instructions

### Basics

* switch to the directory containing **setup_azure_base.sh**

* run **setup_azure_base.sh**

* ensure docker daemon is running, and docker client is available

* browse Kubernetes dashboard in web browser (ties up your terminal):
`az aks browse --name awcluster01`

### Container images

* log in to the container registry: `az acr login`

* upload images to acr:

```
docker image tag daearchive_apache:latest awimages.azurecr.io/daearchive_apache:20200227a
docker image tag daearchive_solr:latest awimages.azurecr.io/daearchive_solr:20200227a
docker image tag daearchive_archive:latest awimages.azurecr.io/daearchive_archive:20200227a
docker push awimages.azurecr.io/daearchive_archive:20200227a
docker push awimages.azurecr.io/daearchive_solr:20200227a
docker push awimages.azurecr.io/daearchive_apache:20200227a
```

### Kubernetes

* switch to the directory containing **setup_k8s_base.sh**

* run **setup_k8s_base.sh**

#### Ingress

* switch to the directory containing **setup_k8s_ingress.sh**

* run **setup_k8s_ingress.sh**

#### Certificates

* switch to the directory containing **setup_k8s_certificates.sh**

* run **setup_k8s_certificates.sh**

* issue staging certificates:
  * (add annotation to ingress: "cert-manager.io/issuer: le-staging")
  * `kubectl apply -f ingresses/archive.yaml`

  (pre-existing certificates are replaced without user interaction)

* check whether Let's Encrypt staging certificates were successfully provisioned  
  (these will provoke a warning of unrecognized issuer in your web browser)

* issue production certificates:
  * (update annotation in ingress: "cert-manager.io/issuer: le-production")
  * `kubectl apply -f ingresses/archive.yaml`

  (pre-existing certificates are replaced without user interaction)

* check whether Let's Encrypt production certificates were successfully provisioned

#### Application releases

The release of applications is controlled by _deployments_. An auditable, and rollbackable method of updating applications on Kubernetes is as follows:

* create a new container image version

* tag the new container image (i.e. 20200227a; the ISO date + an incremental suffix)

* push the new container image to the registry

* update the archive deployment manifest (k8s/deployments/archive.yaml):
(this example is abbreviated to emphasize the relevant changes)

```
 spec:
   template:
     metadata:
       labels:
         io.kompose.service: archive
-        version: "20200223c"
+        version: "20200227a"
     spec:
       containers:
-        image: awimages.azurecr.io/daearchive_apache:20200223c
+        image: awimages.azurecr.io/daearchive_apache:20200227a
```

* set default namespace for kubectl commands:
`kubectl config set-context --current --namespace=archive-wiki`

* apply the changes to the deployment:
`kubectl apply -f k8s/deployments/archive.yaml`

* commit, and push your changes to the git repository for future reference

* [optional] check the status of the release:
`kubectl rollout status deployment/archive`

* [emergency] roll back to the previous release:
`kubectl rollout undo deployment/archive`

### Test and troubleshoot applications

#### View logs

* configure azure-cli defaults (to shorten subsequent commands):  
  `az configure --defaults acr=awimages group=archive-wiki location=westeurope`

* connect to the Kubernetes dashboard:
`az aks browse --name awcluster01`

* view container logs (like `docker logs`)
  * navigate in the web browser to the [deployment section](http://127.0.0.1:8001/api/v1/namespaces/kube-system/services/http:kubernetes-dashboard:/proxy/#!/deployment/archive-wiki/archive?namespace=archive-wiki) of the Kubernetes dashboard
  * click the _Logs_ button on the replica set line
  * in the logs view, consider clicking the clockwise arrow to enable auto refresh

#### Open shell in container

* configure azure-cli defaults (to shorten subsequent commands):  
  `az configure --defaults acr=awimages group=archive-wiki location=westeurope`

* kubectl login:
`az aks get-credentials --name awcluster01`

* set default namespace for kubectl commands (to shorten subsequent commands):  
  `kubectl config set-context --current --namespace=archive-wiki`

* find the pods id:
`kubectl get pods`

* run a shell in the container:
`kubectl exec "$pod_name" -it -- /bin/bash`

#### Configure Solr for first use

* open a shell in the solr container (as noted above)

* follow solr/create_cores.md, but skip the "docker exec solr" at the start of each command

#### Test API

* follow dae-api/README.md, but save the user deletion for last
