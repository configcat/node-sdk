#Update sample apps to the latest
set -e
cd samples/console
npm i configcat-node@latest
cd ../console-esm
npm i configcat-node@latest
cd ../expresswithdocker
npm i configcat-node@latest
cd ../realtimeupdate
npm i configcat-node@latest
cd ../customcache
npm i configcat-node@latest
cd ../..