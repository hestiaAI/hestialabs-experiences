# HestiaLabs Experiences

This repo currently contains two projects:
- packages, where the experiences displayed by the nuxt app are taken from [README.md](packages/README.md)
- data-experience, the vue component for visualizing one data set [README.md](data-experience/README.md)
- experiences, the nuxt app [README.md](experiences/README.md)

This repo is also dependent on the bubble-server [here](https://github.com/hestiaAI/hestialabs-bubble-server)

## setup
**You must use the correct version of npm (8.x) and node (18.x) for this project, we recommend using `nvm` ([installation](https://heynode.com/tutorial/install-nodejs-locally-nvm/)).**

First create a new directory, and clone this repo and the bubble-server: 
```
git clone https://github.com/hestiaAI/hestialabs-experiences.git
git clone https://github.com/hestiaAI/hestialabs-bubble-server.git
```

You must use the correct version of node and npm to run the project (note that nvm for windows may have a different syntax). 
```
nvm use lts/hydrogen
```

Then install and build the bubble-server: 
```
cd hestialabs-bubble-server/
// This line install Poetry, only needed if you don't have it already
curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | python -
poetry install
poetry run pre-commit install
```

Then install and build the packages: 
```
cd ../hestialabs-experiences/packages
npm install
npm run build
npm run prepare
npm link --workspaces
```

Then install and build the Nuxt app: 
```
cd ../experiences
npm install
```

Finally, you can run the project in development mode: 
```
npm run dev
```
