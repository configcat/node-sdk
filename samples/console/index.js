var configcat = require("configcat-node");

const logger = configcat.createConsoleLogger(3); // Setting log level to 3 (= Info) to show detailed feature flag evaluation

const configCatClient = configcat.createClientWithAutoPoll('PKDVCLf-Hq-h-kCzMp-L7Q/HhOWfwVtZ0mb30i9wi17GQ', { pollIntervalSeconds: 2, logger: logger });
// You can instantiate the client with different polling modes. See the Docs: https://docs.configcat.com/docs/sdk-reference/js/#polling-modes

configCatClient.getValueAsync("isAwesomeFeatureEnabled", false).then(value => {
    console.log("isAwesomeFeatureEnabled: " + value);
});

const userObject = { identifier: "#SOME-USER-ID#", email: "configcat@example.com" };
// Read more about the User Object: https://docs.configcat.com/docs/sdk-reference/js/#user-object
configCatClient.getValueAsync("isPOCFeatureEnabled", false, userObject).then(value => {
    console.log("isPOCFeatureEnabled: " + value);
});