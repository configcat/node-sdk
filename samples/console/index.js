var configcat = require("configcat-node");

// Insert your API key
var client = configcat.createClient("PKDVCLf-Hq-h-kCzMp-L7Q/PaDVCFk9EpmD6sLpGLltTA");

var myUser = {
    identifier : "435170f4-8a8b-4b67-a723-505ac7cdea92"
}; 

// Get your config value:
client.getValue("keySampleText", "N/A", (value) => {
    console.log("keySampleText: " + value);
}, myUser);

// Get your config value:
client.getValue("keySampleText_NOTEXISTS", "N/A", (value) => {
    console.log("keySampleText: " + value);
}, myUser);