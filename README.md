# ConfigCat SDK for Node.js
https://configcat.com

ConfigCat SDK for Node.js provides easy integration for your application to ConfigCat.

ConfigCat is a feature flag and configuration management service that lets you separate releases from deployments. You can turn your features ON/OFF using <a href="https://app.configcat.com" target="_blank">ConfigCat Dashboard</a> even after they are deployed. ConfigCat lets you target specific groups of users based on region, email or any other custom user attribute.

ConfigCat is a <a href="https://configcat.com" target="_blank">hosted feature flag service</a>. Manage feature toggles across frontend, backend, mobile, desktop apps. <a href="https://configcat.com" target="_blank">Alternative to LaunchDarkly</a>. Management app + feature flag SDKs.

[![Build Status](https://travis-ci.com/configcat/node-sdk.svg?branch=master)](https://travis-ci.com/configcat/node-sdk) [![codecov](https://codecov.io/gh/configcat/node-sdk/branch/master/graph/badge.svg)](https://codecov.io/gh/configcat/node-sdk) [![Known Vulnerabilities](https://snyk.io/test/github/configcat/node-sdk/badge.svg?targetFile=package.json)](https://snyk.io/test/github/configcat/node-sdk?targetFile=package.json) ![License](https://img.shields.io/github/license/configcat/node-sdk.svg) \
[![NPM](https://nodei.co/npm/configcat-node.png)](https://nodei.co/npm/configcat-node/)

## Getting Started

### 1. Install and import package:

*via NPM [package](https://npmjs.com/package/configcat-node):*
```PowerShell
npm i configcat-node
```
```js
const configcat = require("configcat-node");
```

### 2. Go to the <a href="https://app.configcat.com/sdkkey" target="_blank">Dashboard</a> tab to get your *SDK Key*:
![SDK-KEY](https://raw.githubusercontent.com/ConfigCat/node-sdk/master/media/readme01.png  "SDK-KEY")

### 3. Create a *ConfigCat* client instance:
```js
let configCatClient = configcat.createClient("#YOUR-SDK-KEY#");
```

> We strongly recommend using the *ConfigCat Client* as a Singleton object in your application.

### 4. Get your setting value:
```js
configCatClient.getValueAsync("isMyAwesomeFeatureEnabled", false)
.then((value) => {
    if(value) {
        do_the_new_thing();
    } else {
        do_the_old_thing();
    }
});
```

## Getting user specific setting values with Targeting
Using this feature, you will be able to get different setting values for different users in your application by passing a `User Object` to `getValueAsync()`.

Read more about [Targeting here](https://configcat.com/docs/advanced/targeting/).
```js
const userObject = { identifier : "#USER-IDENTIFIER#" };
configCatClient.getValueAsync("isMyAwesomeFeatureEnabled", false, userObject)
.then((value) => {
    if(value) {
        do_the_new_thing();
    } else {
        do_the_old_thing();
    }
});
```

## Sample/Demo app
  * [Sample Console application](https://github.com/configcat/node-sdk/tree/master/samples/console)
  * [Sample application using Express and Docker](https://github.com/configcat/node-sdk/tree/master/samples/expresswithdocker)

## Polling Modes
The ConfigCat SDK supports 3 different polling mechanisms to acquire the setting values from ConfigCat. After latest setting values are downloaded, they are stored in the internal cache then all requests are served from there. Read more about Polling Modes and how to use them at [ConfigCat Docs](https://configcat.com/docs/sdk-reference/node/).

## Need help?
https://configcat.com/support

## Contributing
Contributions are welcome.

## About ConfigCat
- [Official ConfigCat SDK's for other platforms](https://github.com/configcat)
- [Documentation](https://configcat.com/docs)
- [Blog](https://configcat.com/blog)
