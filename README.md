# ConfigCat SDK for Node.js

ConfigCat SDK for Node.js provides easy integration between ConfigCat service and applications using Node.js.

ConfigCat is a feature flag, feature toggle, and configuration management service. That lets you launch new features and change your software configuration remotely without actually (re)deploying code.
https://configcat.com  

[![Build Status](https://travis-ci.org/configcat/node-sdk.svg?branch=master)](https://travis-ci.org/configcat/node-sdk) [![codecov](https://codecov.io/gh/configcat/node-sdk/branch/master/graph/badge.svg)](https://codecov.io/gh/configcat/node-sdk) [![Known Vulnerabilities](https://snyk.io/test/github/configcat/node-sdk/badge.svg?targetFile=package.json)](https://snyk.io/test/github/configcat/node-sdk?targetFile=package.json) ![License](https://img.shields.io/github/license/configcat/node-sdk.svg) \
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

### 2. <a href="https://configcat.com/Account/Login" target="_blank">Log in to ConfigCat Management Console</a> and go to your *Project* to get your *API Key*:
![API-KEY](https://raw.githubusercontent.com/ConfigCat/node-sdk/master/media/readme01.png  "API-KEY")

### 3. Create a *ConfigCat* client instance:
```js
let configCatClient = configcat.createClient("#YOUR-API-KEY#");
```
### 4. Get your setting value:
```js
configCatClient.getValue("isMyAwesomeFeatureEnabled", false, (value) => {
    if(value) {
        do_the_new_thing();
    } else {
        do_the_old_thing();
    }
});
```

## Getting user specific setting values with Targeting
Using this feature, you will be able to get different setting values for different users in your application by passing a `User Object` to the `getValue()` function.

Read more about [Targeting here](https://docs.configcat.com/docs/advanced/targeting/).
```js
configCatClient.getValue("isMyAwesomeFeatureEnabled", false, (value) => {
    if(value) {
        do_the_new_thing();
    } else {
        do_the_old_thing();
    },
    {identifier : "#USER-IDENTIFIER#"}
});
```

## Sample/Demo app
  [Console App](https://github.com/configcat/node-sdk/tree/master/samples/console/index.js)

## Caching Policies
The ConfigCat SDK supports 3 different caching policies to acquire the setting values from ConfigCat. After latest setting values are downloaded, they are stored in internal cache and then all requests are served from there. Read more about Caching Policies and how to use them at [ConfigCat Docs](https://docs.configcat.com/docs/sdk-reference/node/).

---

## License
[MIT](https://raw.githubusercontent.com/ConfigCat/node-sdk/master/LICENSE)
