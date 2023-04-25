cd packages
npm install
npm run build
npm link --workspaces
cd ../data-experience
npm install
npm run build
cd ../experiences
npm install
rm -rf dist
CONFIG_NAME=digipower-academy BASE_URL=https://digipower.academy API_URL=https://bubbles.hestialabs.org npm run build
git add dist
git commit -m rebuilt
git push
