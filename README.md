# HestiaLabs Experiences

This repo currently contains three projects:
- [packages](packages/README.md): Monorepo for packages used throughout the system, including data experience packages.
- [data-experience](data-experience/README.md): Vue component for the data experience to visualize one data set. Every new dataset we want to visualise starts from there.
- [dc-dashboard](dc-dashboard/README.md): A library to generate interactive dashboards.
- [experiences](experiences/README.md): Nuxt app, where [digipower.academy](https://digipower.academy) lives.

This repo is also dependent on the [bubble-server](https://github.com/hestiaAI/hestialabs-bubble-server)

## Setup
**You must use the correct version of npm (8.x) and node (18.x) for this project, we recommend using `nvm` ([installation](https://heynode.com/tutorial/install-nodejs-locally-nvm/)).**

First create a new directory, and clone this repo and the bubble-server:
```sh
git clone https://github.com/hestiaAI/hestialabs-experiences.git
git clone https://github.com/hestiaAI/hestialabs-bubble-server.git
```

You must use the correct version of node and npm to run the project (note that nvm for Windows may have a different syntax.)
First install `nvm` if you don't have it already: [install instruction](https://github.com/nvm-sh/nvm) or with HomeBrew `brew install nvm`. Then install `lts/hydrogen`: 
```sh
nvm install nvm/hydrogen
```
And finally set the correct version of `npm` to run this project: 
```sh
nvm use lts/hydrogen
```

Then install and build the bubble-server:
```sh
cd hestialabs-bubble-server
# This line install Poetry, only needed if you don't have it already
pip install poetry
poetry install
poetry run pre-commit install
```

Then install and build the packages:
```sh
cd ../hestialabs-experiences/packages
npm i
npm run build
npm run prepare
npm link --workspaces
```

Then install and build `data-experience`:
```sh
cd ../data-experience
```

Add an extensionless environment file `.env` with the following configuration:

```
echo "NODE_ENV=development" > .env
```

Then run
```sh
npm i
npm run build
```

You can run the data experience module in development mode with
```sh
npm run dev
```

Then install modules for the Nuxt app:
```sh
cd ../experiences
npm i
```

You can run the Nuxt app in development mode with
```sh
npm run dev
```
