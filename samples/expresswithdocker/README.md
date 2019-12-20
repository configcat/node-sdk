# Sample application using Express and Docker

This is a simple nodeJS application to demonstrate how to use the ConfigCat SDK on NodeJS with Express and Docker.

# Run web application on local machine
## Install dependencies

```
npm i
```

## Start webserver

```
npm start
```

# Run web application in Docker

## Build your Docker image

```
docker build -t configcat/expressdemo .
```

## Run Docker image

```
docker run -p 8088:8088 -d configcat/expressdemo
```

# Try it by sending GET requests

Open these urls:

* http://localhost:8088 to test your webserver or 
* http://localhost:8088/keys to get all keys of the subscription or
* http://localhost:8088/isAwesomeFeatureEnabled to get 'isAwesomeFeatureEnabled' feautreflag's value