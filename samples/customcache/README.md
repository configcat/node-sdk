# Sample application using custom cache implementation

This is a simple nodeJS application to demonstrate how to use your cache implementation in configcat. The `configcat-redis-cachejs` file shows how can you create simple adapter for redis cache.

# Run web application on local machine
## Install dependencies

```
npm i
```

### Setup redis
The easiest way to get a redis instance on your machine is a docker based solution.

1. Pull the latest redis docker images
```
docker pull redis
```
2. Run the contanier
```
docker run --name container-redis -p 6379:6379 -d redis
```

## Start console application

```
npm start
```
