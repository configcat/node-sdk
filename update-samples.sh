#Update sample apps to the latest
cd samples/console
npm i configcat-node@latest
cd ../expresswithdocker
npm i configcat-node@latest
cd ../..
git add .
git commit -m "updating sample apps"
git push