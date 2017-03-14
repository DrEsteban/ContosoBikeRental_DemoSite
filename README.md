# Contoso BikeRental DemoSite repo

## Initial Setup
When you first clone this repository, you'll need to initialize the Bikes submodule with the following commands at repo root:
```
git submodule init
git submodule update
```

You also need to configure the DocumentDB connection string in `./contoso.demosite/values.yaml`. The value is:
```
contoso-bikerental-bikes:
    mongo:
        connectionString: < put DocumentDB connection string here >
```

## Running in Docker-compose
Run at repo root:
```
docker-compose up --build
```

## Running in Kubernetes
You will need a pre-configured Kubectl that can talk to your k8 instance, and the [Helm](https://github.com/kubernetes/helm) tool installed.

NOTE: When you first install Helm, you need to initialize your k8 instance with Tiller via `helm init`

```
# Copies the Bikes chart to the correct location
./get_charts.sh

# Installs to k8
helm install contoso.demosite/
```

NOTE: You must manually deploy a Secret to k8 that contains your private registry credentials. The selector for private registry and secret info is configured by the Charts `values.yaml`