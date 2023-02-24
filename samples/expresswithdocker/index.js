const SDKKEY = "PKDVCLf-Hq-h-kCzMp-L7Q/HhOWfwVtZ0mb30i9wi17GQ";
const PORT = 8088;
const SAMPLE_KEY = "isAwesomeFeatureEnabled";

var express = require("express");
var configcat = require("configcat-node");
var app = express();
app.disable("x-powered-by");

var logger = configcat.createConsoleLogger(configcat.LogLevel.Info); // Setting log level to Info to show detailed feature flag evaluation

let configCatClient = configcat.getClient(SDKKEY, configcat.PollingMode.AutoPoll, { logger: logger, pollIntervalSeconds: 2 });

app.get("/", function(req, res) {
  res.send("Express is running...");
});

app.get("/" + SAMPLE_KEY, async function(req, res) {
  const feature2 = await configCatClient.getValueAsync(SAMPLE_KEY, false);
  console.log(SAMPLE_KEY + ": " + feature2);

  res.send(SAMPLE_KEY + " -> " + feature2);
});

app.get("/keys", async function(req, res) {
  const keys = await configCatClient.getAllKeysAsync();
  console.log("keys: " + keys);

  res.send("keys: '" + keys + "'");

});

app.listen(PORT);
