var configcat = require("configcat-client");

// Insert your API key
var client = configcat.createClient("PKDVCLf-Hq-h-kCzMp-L7Q/PaDVCFk9EpmD6sLpGLltTA");

// Get your config value:
client.getValue("keySampleText", "N/A", (value) => {
    console.log("keySampleText: " + value);
});