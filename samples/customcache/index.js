const configcat = require("configcat-node");
const redis = require("redis");
const configcatRedisCache = require("./configcat-redis-cache");

const redisOptions = { host : "localhost", port: 6379 };

const configCatClient = configcat.getClient('PKDVCLf-Hq-h-kCzMp-L7Q/HhOWfwVtZ0mb30i9wi17GQ', configcat.PollingMode.AutoPoll,
{
     cache: new configcatRedisCache(redisOptions)     
});

setInterval(() => {
    configCatClient.getValueAsync("isPOCFeatureEnabled", false,  { email: "configcat@example.com" }).then(value => {
        console.log(new Date().toTimeString() + " isPOCFeatureEnabled: " + value);
    });
}, 5000);  
