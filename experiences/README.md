# HestiaLabs Experiences

![npm](https://img.shields.io/badge/npm-7.x-blue) ![node](https://img.shields.io/badge/node-14.x-brightgreen)

The experiences developed by HestiaLabs are targeted for any user willing to better understand their personal data. It takes the form of an easy-to-use web app that locally processes the raw personal data downloaded from various sources (Twitter, Facebook, Uber, etc) and creates meaningful visualizations.

## Setup

0. Check that you have the correct versions for npm and node (see "engines" in package.json: node 14.x, npm 7.x) by running `npm version`

1. Clone this repo and name the directory `hestialabs-experiences`. Then clone the repo [hestialabs](https://github.com/hestiaAI/hestialabs) and name the directory `hestialabs`. These two directories should be siblings and share a parent directory.

2. In the `hestialabs` repo, install the root package:

```sh
$ cd ../hestialabs
$ npm install
```

3. Then, in `hestialabs`, create symlinks to all packages in the monorepo and save them in the global `node_modules/` folder (see [npm-link documentation](https://docs.npmjs.com/cli/v8/commands/npm-link)):

```sh
$ npm link --workspaces
```

4. Navigate back to `hestialabs-experiences/experiences` and install the root package. This triggers the [`postinstall`](./postinstall.js) [post script](https://docs.npmjs.com/cli/v8/using-npm/scripts#pre--post-scripts) that creates symlinks from the previously globally-linked packages to the `node_modules/` of the current folder.

```sh
$ cd ../hestialabs-experiences/experiences
$ npm install
```

5. Clone [hestialabs-bubble-server](https://github.com/hestiaAI/hestialabs-bubble-server), and install it as described in its README.md.

6. to run experiences run `npm run dev`. This runs the three repos A tab should open in your browser and allow you to run the experiences. To run it without the bubble server and access our production server instead, run `API_URL=https://bubbles.hestialabs.org npm run dev:no-local-server`.

## Instances

The instances are deployed on [netlify](https://app.netlify.com/teams/hestia/overview), where you can see a log of their [build](https://app.netlify.com/teams/hestia/builds/). They each point to a different branch of this repo.

| Instance           | [test.hestialabs.org](https://test.hestialabs.org/)                                                                                                                   | [experiences.hestialabs.org](https://experiences.hestialabs.org/)                                                                                                       | [digipower.hestialabs.org](https://digipower.hestialabs.org/)                                                                                                  | [tfac.hestialabs.org](https://tfac.hestialabs.org/)                                                                                                       | [digipower.academy](https://digipower.academy/)                                                                                                                        |
| :----------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| branch             | [netlify-test](https://github.com/hestiaAI/hestialabs-experiences/tree/netlify-test)                                                                                  | [netlify](https://github.com/hestiaAI/hestialabs-experiences/tree/netlify)                                                                                              | [netlify-digipower](https://github.com/hestiaAI/hestialabs-experiences/tree/netlify-digipower)                                                                 | [netlify-tfac](https://github.com/hestiaAI/hestialabs-experiences/tree/netlify-tfac)                                                                      | [netlify-academy](https://github.com/hestiaAI/hestialabs-experiences/tree/netlify-academy)                                                                             |
| netlify name       | test-experiences                                                                                                                                                      | hestia-experiences                                                                                                                                                      | digipower                                                                                                                                                      | tfac                                                                                                                                                      | digipower.academy                                                                                                                                                      |
| purpose            | testing, typically with all features and experiences enabled                                                                                                          | our public showcase                                                                                                                                                     | the sitra project                                                                                                                                              | a tool for the [Tracking-Free Ads Coalition](https://trackingfreeads.eu/)                                                                                 |                                                                                                                                                                        |
| config             | `config/config.json`                                                                                                                                                  | `config/workshop.json`                                                                                                                                                  | `config/digipower.json`                                                                                                                                        | `config/tfac.json`                                                                                                                                        | `config/digipower-academy.json`                                                                                                                                        |
| running it locally | `npm run dev`                                                                                                                                                         | `CONFIG_NAME=workshop npm run dev`                                                                                                                                      | `CONFIG_NAME=digipower npm run dev`                                                                                                                            | `CONFIG_NAME=tfac npm run dev`                                                                                                                            | `CONFIG_NAME=digipower-academy npm run dev`                                                                                                                            |
| status             | [![Netlify Status](https://api.netlify.com/api/v1/badges/9449a6d8-d0a1-4432-8d24-aa0537a8976f/deploy-status)](https://app.netlify.com/sites/test-experiences/deploys) | [![Netlify Status](https://api.netlify.com/api/v1/badges/d333f584-0ec2-4180-ab28-1edfede952eb/deploy-status)](https://app.netlify.com/sites/hestia-experiences/deploys) | [![Netlify Status](https://api.netlify.com/api/v1/badges/6eaae950-17e0-4a98-a0be-d44aab17c2bf/deploy-status)](https://app.netlify.com/sites/digipower/deploys) | [![Netlify Status](https://api.netlify.com/api/v1/badges/4b4d37c9-a54b-4acd-aee6-877774ff51a5/deploy-status)](https://app.netlify.com/sites/tfac/deploys) | [![Netlify Status](https://api.netlify.com/api/v1/badges/424b46ad-8ef7-4a93-8599-91a3468ed66f/deploy-status)](https://app.netlify.com/sites/digipower-academy/deploys) |

Logs for the netlify functions are accessible in each site's netlify under Functions

### Deployment configuration

Environment variables are set in [netlify](https://app.netlify.com/sites/hestia-experiences/settings/deploys#environment)

| Environment variable      | Description                                                                      |
| ------------------------- | -------------------------------------------------------------------------------- |
| CONFIG_NAME               | Name of the configuration file (without extension: "workshop", "digipower" ...)  |
| BASE_URL                  | Url where the website is deployed (with protocol: "https://test.hestialabs.org") |
| API_URL                   | URL of the rest api (with protocol: "https://bubbles.hestialabs.com")            |
| HESTIA_OWNER_GITHUB_TOKEN | Access token that allows using github packages                                   |

Documentation for the configuration file can be found in [config/README.md](config)

## For developers

```bash
# All commands are run in the same folder as this readme
$ cd experiences
```

### Build Setup

```bash
# All commands are run in the same folder as this readme
$ cd experiences

# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out the [documentation](https://nuxtjs.org).

### Global Configuration

The files in `config` let us set parameters for each deployment. [See the README](config) for more details about the different parameters.

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

### Structure

The app follows the default structure of Nuxt, [see the docs](https://nuxtjs.org/docs/get-started/directory-structure) for more details about the different directories.

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

#### Continuous integration

We are using circle ci to protect the master branch on github.
TODO: we should really document how this is set up.

### Upgrading npm on Windows

This is only relevant for Windows users who work with nvm.

We work with a version of npm more recent than the one shipped with the node LTS we are using. There is a standard way of upgrading npm, but it doesn't work with nvm-windows. The way to do it is described in this [comment on github](https://github.com/coreybutler/nvm-windows/issues/300#issuecomment-798776683):

- download [this](https://gist.github.com/nokidding/aafaf90adc80cbce54b676340817bb13) as updateNpm.bat file
- open powershell in that same folder and run this command ./updateNpm.bat latest

## Graphs, Plots and Visualisation

Is is possible to dynamically create graphic representation of the data. The can take the form of charts (hystograms, pie charts etc), maps with overlay, etc.

Chart type are defined by files in [this directory](https://github.com/hestiaAI/hestialabs-experiences/tree/master/components/chart/view).
The files use the [D3](https://vuejsexamples.com/tag/d3/) graphics and charts library on top of the [Vue framework](https://vuejs.org/).

The charts are then available for use in [hestialabs](https://github.com/hestiaAI/hestialabs) experience packages. They are called in `blocks.ts` files. For instance, the [Netflix blocks.ts file](https://github.com/hestiaAI/hestialabs/blob/master/packages/netflix/src/blocks.ts) calls `ChartViewTimeSeries.vue` as defined in the file [ChartViewTimeSeries.vue](https://github.com/hestiaAI/hestialabs-experiences/blob/master/components/chart/view/ChartViewTimeSeries.vue).

For debugging purposes, passing option `showTable: true` displays a text table representation of the data.
