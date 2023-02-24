var configcat = require("configcat-node");
var PubNub = require('pubnub');

// ConfigCat related variables
const configcatSettingKey = "isAwesomeFeatureEnabled"; // Copy your feature flag or setting key from https://app.configcat.com
const configcatSdkKey = "PKDVCLf-Hq-h-kCzMp-L7Q/HhOWfwVtZ0mb30i9wi17GQ"; // Copy your Configcat SDK Key: https://app.configcat.com/sdkkey

// PubNub related variables
const pubnubSubscriberKey = "demo";
const pubnubPublishKey = "demo";

// ConfigCat instance with manual poll. Polls ConfigCat and updates the cache only when forceRefresh() is called.
var configCatClient = configcat.getClient(configcatSdkKey, configcat.PollingMode.ManualPoll);

// PubNub instance
var pubnub = new PubNub({
  subscribeKey: pubnubSubscriberKey,
  publishKey: pubnubPublishKey,
  uuid: "configCat-pubNub-sample"
})

// Adding a listener for PubNub messages
pubnub.addListener({
  message: function(m) {
    var msg = m.message;
    console.log(msg);
    if (msg.CMD == "FORCEUPDATE") {
      // Updates the cache if the message is: { CMD: 'FORCEUPDATE' }
      configCatClient.forceRefreshAsync().then(value => {
        console.log("Force update message received from PubNub. Updated cache.");
      })
    }
  }
});

// Subscribing to the working demo channel
pubnub.subscribe({
  channels: ['configcat-channel']
});

// Reading the cached feature flag value.
function readValueFromCache() {
  configCatClient.getValueAsync(configcatSettingKey, false).then(value => {
    console.log(configcatSettingKey + ": " + value);
  });
}

// Updating the cache once when the app starts to make sure ConfigCat service is accessible and a valid value gets cached.
configCatClient.forceRefreshAsync().then(() => {
  setInterval(() => { readValueFromCache() }, 5000);
});
