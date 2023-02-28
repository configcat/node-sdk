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

  this.lastCacheItems = {};
}

configcatRedisCache.prototype.get = async function(key) {

  if (!this.isRedisAvailable) {
    return this.lastCacheItems[key];
  }

  try {
    const getAsync = util.promisify(this.cacheClient.get).bind(this.cacheClient);

    return JSON.parse(await getAsync(key));
  }
  catch (e) {
    console.error("Cache read failed!\n" + e);
    return this.lastCacheItems[key];
  }
};

configcatRedisCache.prototype.set = async function(key, item) {

  this.lastCacheItems[key] = item;

  try {
    const setAsync = util.promisify(this.cacheClient.set).bind(this.cacheClient);

    await setAsync(key, JSON.stringify(item));
  }
  catch (e) {
    console.error("Cache write failed!\n" + e);
  }
};

module.exports = configcatRedisCache;
