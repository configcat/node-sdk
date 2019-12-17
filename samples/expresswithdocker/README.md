# Express (with docker)

This is a simple nodeJS application to demostrates how to use the configcat SDK on nodeJS platform with express and docker.

# Run web application on local machine
## Install dependencies

```
npm i
```

## Start webserver

```
npm start
```

# Run web application in docker

## Build your docker image

```
docker build -t configcat/expressdemo .
```

## Run docker image

```
docker run -p 8088:8088 -d configcat/expressdemo
```

# Send some GET request to webserver

Open these urls:

* http://localhost:8088 to test your webserver or 
* http://localhost:8088/keys to get all keys of the subscription or
* http://localhost:8088/isAwesomeFeatureEnabled to get 'isAwesomeFeatureEnabled' feautreflag's value