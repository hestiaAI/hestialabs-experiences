# HestiaLabs Experiences

![npm](https://img.shields.io/badge/npm-%3E%3D10-blue) ![node](https://img.shields.io/badge/node-22-brightgreen)

The experiences developed by HestiaLabs are targeted for any user willing to better understand their personal data. It takes the form of an easy-to-use web app that locally processes the raw personal data downloaded from various sources (Twitter, Facebook, Uber, etc) and creates meaningful visualizations.

## Setup

0. Check that you have the correct versions for npm and node (see "engines" in package.json: node 22 or later, npm 10 or later) by running `npm version`

1. In the `packages` folder, install the root package:

```sh
$ cd ../packages
$ npm install
```

2. Then, still in the folder `packages`, build the packages in the monorepo:

```sh
$ npm run build
```

3. Navigate back to folder `experiences` and install the root package. This triggers the [`postinstall`](./postinstall.cjs) [post script](https://docs.npmjs.com/cli/v8/using-npm/scripts#pre--post-scripts) that symlinks the experiences listed in `config/${CONFIG_NAME}.json` (default `dev`) from `../packages` into `node_modules/@hestia.ai/`.

(`npm run setup -- --site` from the repository root does steps 1–3 and builds `dc-dashboard` and `data-experience` too.)

```sh
$ cd ../experiences
$ npm install
```

4. Set up pre-commit hooks:

```
npm run prepare
```

5. Clone [hestialabs-bubble-server](https://github.com/hestiaAI/hestialabs-bubble-server), and install it as described in its README.md.

6. to run experiences run `npm run dev`. This runs the three repos A tab should open in your browser and allow you to run the experiences. To run it without the bubble server and access our production server instead, run `API_URL=https://bubbles.hestialabs.org npm run dev:no-local-server`.

## Instances

The instances are deployed on [netlify](https://app.netlify.com/teams/hestia/overview), where you can see a log of their [build](https://app.netlify.com/teams/hestia/builds/). They each point to a different branch of this repo.
redirect-to-digipower-academy
| Instance | [test.hestialabs.org](https://test.hestialabs.org/) | [digipower.academy](https://digipower.academy/) | [experiences.hestialabs.org](https://experiences.hestialabs.org/) | [digipower.hestialabs.org](https://digipower.hestialabs.org/) | [tfac.hestialabs.org](https://tfac.hestialabs.org/) |
|:-------------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|:-------------------------------------------------------------------------------------------------|:-----------------------------------------------------------------------------------------------------------|:------------------------------------------------------------------------------------------------------|
| branch | [netlify-test](https://github.com/hestiaAI/hestialabs-experiences/tree/netlify-test) | [netlify-academy](https://github.com/hestiaAI/hestialabs-experiences/tree/netlify-academy) | [redirect-to-digipower-academy](https://github.com/hestiaAI/hestialabs-experiences/tree/redirect-to-digipower-academy) | [redirect-to-digipower-academy](https://github.com/hestiaAI/hestialabs-experiences/tree/redirect-to-digipower-academy) | [redirect-to-digipower-academy](https://github.com/hestiaAI/hestialabs-experiences/tree/redirect-to-digipower-academy) |
| netlify name | test-experiences | digipower.academy | hestia-experiences | digipower | tfac |
| purpose | testing, typically with all features and experiences enabled | | | | |
| config | `config/config.json` | `config/digipower-academy.json` | | | |
| running it locally | `npm run dev` | | | | |
| status | [![Netlify Status](https://api.netlify.com/api/v1/badges/9449a6d8-d0a1-4432-8d24-aa0537a8976f/deploy-status)](https://app.netlify.com/sites/test-experiences/deploys) | [![Netlify Status](https://api.netlify.com/api/v1/badges/424b46ad-8ef7-4a93-8599-91a3468ed66f/deploy-status)](https://app.netlify.com/sites/digipower-academy/deploys) | | | |

## For developers

```bash
# All commands are run in the same folder as this readme
$ cd experiences
```

### Deployment

Deployment is manual; CI does not deploy. Each Netlify site serves the prebuilt `experiences/dist` committed on its branch (see [Instances](#instances) and `netlify.toml`), and Netlify only redeploys when `dist` changes.

To deploy https://digipower.academy:

```bash
# from the repository root
git checkout netlify-academy
git pull
# replace current files with what's in master
git merge -X theirs master
./deploy_digipower.sh
```

`deploy_digipower.sh` runs `scripts/setup.sh --site` with `CONFIG_NAME=digipower-academy` (installs and builds `packages`, `dc-dashboard` and the `data-experience` library, then installs this site), builds the site into `dist` and commits and pushes it. Netlify then redeploys the website.

For another instance, do the same on its branch with its own variables:

| website             | build command                                                                                                         |
| ------------------- | --------------------------------------------------------------------------------------------------------------------- |
| test.hestialabs.org | BASE_URL=https://test.hestialabs.org API_URL=https://bubbles.hestialabs.org npm run build                             |
| digipower.academy   | CONFIG_NAME=digipower-academy BASE_URL=https://digipower.academy API_URL=https://bubbles.hestialabs.org npm run build |

Here's what these variables configure.
| Environment variable | Description |
|---------------------------|-------------------------------------------------------------------------------------------------|
| CONFIG_NAME | Name of the configuration file (without extension: "digipower-academy", "dev" ...). Set it for `npm install` too: it selects which experiences are linked. |
| BASE_URL | Url where the website is deployed (with protocol: "https://test.hestialabs.org") |
| API_URL | URL of the bubble server (with protocol: "https://bubbles.hestialabs.org") |

Documentation for the configuration file can be found in [config/README.md](config)

What the deployed site loads at runtime:

- **Experiences listed in the config** are built into the site from this monorepo (`npm install` links them; it installs them from npm only when `NODE_ENV=production`). They need not be published to npm.
- **Viewer options**: experiences listed under `experienceViewerOptions` in the config fetch their viewer JSON from that URL (the [experience-viewer-options](https://github.com/digipower-academy/experience-viewer-options) repo for digipower.academy). Experiences not listed there, such as `yoojo` and `uber-eats`, use the viewer JSON in their package. If you add an experience to that map, add its `<name>-viewer.json` to that repo first.
- **Experiences a bubble uses but the site does not list** are loaded from jsDelivr (`https://cdn.jsdelivr.net/npm/@hestia.ai/<name>`), so they must be published to npm (see `packages/README.md`).
- **Bubbles** are served by the bubble server at `API_URL`, deployed separately (see the [hestialabs-bubble-server](https://github.com/digipower-academy/hestialabs-bubble-server) README).

`.gitlab-ci.yml` deploys only the `data-experience` dev app, not these sites.

### Build Setup

The project is built with nuxt. For detailed explanations check out the [nuxt documentation](https://nuxtjs.org).
The app follows the default structure of Nuxt, [see the docs](https://nuxtjs.org/docs/get-started/directory-structure) for more details about the different directories.

To run the dev version, run this script and be patient, this will install all dependencies from sibling projects.

```bash
# on windows you can run this in git bash
$ ./dev.sh
```

If the sibling projects are already installed, you can run the dev version with

```bash
npm run dev
```

### Global Configuration

The files in `config` let us set parameters for each deployment. [See the README](config/README.md) for more details about the different parameters.

The default is [config/config.json](config/config.json) (the test deployment), but if you want to use another configuration like `config/workshop.json`, set the environment variable **CONFIG_NAME**

```bash
# for development
$ CONFIG_NAME=workshop npm run dev
```

```bash
# for production
$ CONFIG_NAME=workshop BASE_URL=https://experiences.hestialabs.org npm run build
# launch server
$ npm run start
```

### Testing

```bash
# Run all the tests
$ npm run test

# Run tests interactively
$ npm run test -- --watch

# Update snapshots
$ npm run test -- -u

# Update snapshots interactively
$ npm run test -- -i
```

(More fine-grained options are available [in the docs](https://jestjs.io/docs/cli))

Tests are run with the [Jest](https://jestjs.io/) framework. There are currently three types of tests that can be written.

#### Unit tests

Unit tests for `.js` files can be written using Jest. An example is available in [utils/csv.test.js](utils/csv.test.js).

#### Component unit tests

Unit tests on components can be written with the help of Jest and [Vue test utils](https://vue-test-utils.vuejs.org/). An example is available in [components/unit/filterable-table/\_\_tests\_\_/UnitFilterableTable.test.js](components/unit/filterable-table/__tests__/UnitFilterableTable.test.js). It shows how to mount a component, mock the vuex store, and find specific HTML elements.

Please follow the same naming convention: create a `__tests__` folder at the same level as the tested component, and name the test file `ComponentName.test.js`.

#### Snapshot tests

Snapshot tests can be written to check that the HTML content of a component hasn't changed, by comparing it to a string saved in the `__snapshots__` folder. If the changes are intentional, snapshots can be updated with the command above.

An example is available in [components/unit/filterable-table/\_\_tests\_\_/UnitFilterableTable.test.js](components/unit/filterable-table/__tests__/UnitFilterableTable.test.js)

Note that snapshots do not include Vue props or data, and that child components are not recursively rendered as HTML (e.g. a component `BaseButton` will appear as an HTML tag `<basebutton>`).

### Upgrading npm on Windows

This is only relevant for Windows users who work with nvm.

We work with a version of npm more recent than the one shipped with the node LTS we are using. There is a standard way of upgrading npm, but it doesn't work with nvm-windows. The way to do it is described in this [comment on github](https://github.com/coreybutler/nvm-windows/issues/300#issuecomment-798776683):

- download [this](https://gist.github.com/nokidding/aafaf90adc80cbce54b676340817bb13) as updateNpm.bat file
- open powershell in that same folder and run this command ./updateNpm.bat latest

## Graphs, Plots and Visualisation

Is is possible to dynamically create graphic representation of the data. The can take the form of charts (hystograms, pie charts etc), maps with overlay, etc.

Chart type are defined by files in [this directory](https://github.com/hestiaAI/hestialabs-experiences/tree/master/components/chart/view).
The files use the [D3](https://vuejsexamples.com/tag/d3/) graphics and charts library on top of the [Vue framework](https://vuejs.org/).

The charts are then available for use in [hestialabs](https://github.com/hestiaAI/hestialabs) experience packages. They are called in `blocks.ts` files. For instance, the [Netflix blocks.ts file](https://github.com/hestiaAI/hestialabs/blob/master/packages/experiences/netflix/src/blocks.ts) calls `ChartViewTimeSeries.vue` as defined in the file [ChartViewTimeSeries.vue](https://github.com/hestiaAI/hestialabs-experiences/blob/master/components/chart/view/ChartViewTimeSeries.vue).

For debugging purposes, passing option `showTable: true` displays a text table representation of the data.
