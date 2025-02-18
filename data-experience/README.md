# data-experience

## Project setup

Add an extensionless environment file `.env` with the following configuration:

```
NODE_ENV=development
```

Make sure you have the latest version of all packages

```bash
cd ../packages
npm install
npm run build
npm link --workspaces
cd ../data-experience
npm install
```

Make sure to use the exact version of node we want. If you don't the build system will tell you which one to use.

### Compiles and hot-reloads for development

The example is in folder dev/

```sh
npm run dev
```

### Compiles and minifies for production

```sh
npm run build
```

### Lints and fixes files

```sh
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

### This project was created with vue-cli

```sh
npm init
npm install @vue/cli
npx vue create experience-component
```

And then modified according to https://itnext.io/create-a-vue-js-component-library-as-a-module-part-1-a1116e632751

## Publish to npm

First increment version in `package.json` and run

```sh
npm run build
npm publish
```

The latest version of the library can be imported using these CDN links:

- https://unpkg.com/@hestia.ai/data-experience/dist/DataExperience.umd.min.js
- https://unpkg.com/@hestia.ai/data-experience/dist/DataExperience.css

## Usage

See the [deployment examples](./deployment-examples/). The simplest one is in [html-plain](./deployment-examples/html-plain/index.html). Run it in your browser through [raw.githack.com](https://raw.githack.com/hestiaAI/hestialabs-experiences/master/data-experience/deployment-examples/html-plain/index.html)
