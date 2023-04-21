cd ../packages
npm install
npm run build
npm link --workspaces
cd ../data-experience
npm install
npm run build
cd ../experiences
npm install
npm run dev