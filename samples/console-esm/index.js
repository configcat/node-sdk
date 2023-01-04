import * as configcat from "configcat-node";

const logger = configcat.createConsoleLogger(configcat.LogLevel.Info); // Setting log level to Info to show detailed feature flag evaluation

const configCatClient = configcat.getClient('PKDVCLf-Hq-h-kCzMp-L7Q/HhOWfwVtZ0mb30i9wi17GQ', configcat.PollingMode.AutoPoll, { pollIntervalSeconds: 2, logger: logger });
// You can instantiate the client with different polling modes. See the Docs: https://configcat.com/docs/sdk-reference/node/#polling-modes

const value = await configCatClient.getValueAsync("isAwesomeFeatureEnabled", false);
console.log("isAwesomeFeatureEnabled: " + value);

// Read more about the User Object: https://configcat.com/docs/sdk-reference/node/#user-object
const userObject = { identifier: "#SOME-USER-ID#", email: "configcat@example.com" };

const value2 = await configCatClient.getValueAsync("isPOCFeatureEnabled", false, userObject);
console.log("isPOCFeatureEnabled: " + value2);

configCatClient.dispose();
