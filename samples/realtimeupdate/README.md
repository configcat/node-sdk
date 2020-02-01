# Sample application demonstrating how to connect ConfigCat to PubNub

Using PubNub delivery provider your application gets notified on configuration changes instantly via server sent messages.
This way polling Configcat for new values isn't necessary since in some cases (Mobile applications) polling is an anti-pattern (CPU load, Battery drain). 

Running the sample app with own ConfigCat account:

1. Add a feature flag https://app.configcat.com/add-setting
2. Copy your newly created feature flag's key from https://app.configcat.com to `index.js`
   ```js
   const configcatSettingKey = "<YOUR-FEATURE-FLAG-KEY>";
   ```
    
3. Copy your Configcat API Key from https://app.configcat.com/apikey to `index.js`
   ```js
   const configcatApiKey = "<YOUR-API-KEY>"; 
   ```
4. Add a `HTTP GET` webhook (https://app.configcat.com/webhooks) with a PubNub URL.
   The PubNub URL can be either your own or the following working demo URL to make 
   sure PubNub gets notified when your feature flag values change.
   `https://ps.pndsn.com/publish/demo/demo/0/configcat-channel/myCallback/%7B%22CMD%22%3A%22FORCEUPDATE%22%7D`
5. Run the sample app:
   ```
   npm install && node index.js
   ```
6. Change $ Save your feature flag value to see updates in the log.

You should see something like this in your log:
```
isAwesomeFeatureEnabled: false
isAwesomeFeatureEnabled: false
isAwesomeFeatureEnabled: false
{ CMD: 'FORCEUPDATE' }
Force update message received from PubNub. Updated cache.
isAwesomeFeatureEnabled: true
isAwesomeFeatureEnabled: true
isAwesomeFeatureEnabled: true
```