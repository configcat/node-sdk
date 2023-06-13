const util = require("util");
const redis = require("redis");

function configcatRedisCache(redisClientOps) {

  this.isRedisAvailable = false;
  this.cacheClient = redis.createClient(redisClientOps);

  this.cacheClient.on("connect", function() {
    console.log("Connected to Redis");
    this.isRedisAvailable = true;
  });

  this.cacheClient.on("error", function(err) {
    console.log("Redis error: " + err);
    this.isRedisAvailable = false;
  });
}

configcatRedisCache.prototype.get = async function(key) {

  if (this.isRedisAvailable) {
    const getAsync = util.promisify(this.cacheClient.get).bind(this.cacheClient);

    return await getAsync(key);
  }
};

configcatRedisCache.prototype.set = async function(key, item) {

  if (this.isRedisAvailable) {
    const setAsync = util.promisify(this.cacheClient.set).bind(this.cacheClient);

    await setAsync(key, item);
  }
};

module.exports = configcatRedisCache;
