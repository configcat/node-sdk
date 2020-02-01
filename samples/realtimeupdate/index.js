const configcatApiKey = "rlPVCCuDMlXYrZsu5t36FQ/9V3VCA4g2GepqkiG_MPZ5w";
const pubnubSubscriberKey = "demo";
const pubnubPublishKey = "demo";
const configcatSettingKey = "demoswitch";

// On ConfigCat Dashboard (https://app.configcat.com/webhooks) create a HTTP-GET webhook with your PubNub URL.
// Your PubNub URL should be something like this 
// https://ps.pndsn.com/publish/demo/demo/0/configcat-channel/myCallback/%7B%22CMD%22%3A%22FORCEUPDATE%22%7D


var configcat = require("configcat-node");
var PubNub = require('pubnub');

var configCatOptions = {
    configChanged: () => {console.log("[ConfigCat] : config changed!")}   
}

// ConfigCat instance

var configCatClient = configcat.createClientWithManualPoll(configcatApiKey);

// PubNub instance

var pubnub = new PubNub({
        subscribeKey: pubnubSubscriberKey,
        publishKey: pubnubPublishKey,
        uuid: "configCat-pubNub-sample"
})

pubnub.addListener({
    message: function(m) {
        var msg = m.message; 
        console.log(msg);
        if (msg.CMD == "FORCEUPDATE"){
            configCatClient.forceRefreshAsync().then(value => {
                console.log("[PubNub] : refresh my config cache");
            })
        }
    }
});

pubnub.subscribe({
    channels: ['configcat-channel'] 
});

function readValueFromCache(i){
    
    configCatClient.getValueAsync(configcatSettingKey, false).then(value => {
        console.log(configcatSettingKey + ": " + value);
        setTimeout(w => readValueFromCache(w), i, i);
    });    
}

// get the latest config (only once)
configCatClient.forceRefreshAsync().then(value => {

    // start the loop to read config from cache in every 5000 ms
    readValueFromCache(5000);
});