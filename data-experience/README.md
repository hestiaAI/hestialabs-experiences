# data-experience

## Build library

```sh
npm run build
```

## Publish to npm

First increment version in package.json

```sh
npm run build
npm publish
```

The latest version of the library can be imported using these CDN links:

https://unpkg.com/@hestia.ai/data-experience/dist/DataExperience.umd.js
https://unpkg.com/@hestia.ai/data-experience/dist/DataExperience.css

## Project setup

Add an extensionless environment file `.env` with the following configuration:

```
NODE_ENV=development
```

Run the following

```sh
npm install
```

### Compiles example and hot-reloads for development

The example is in folder `dev/`

```sh
npm run dev
```

This example can be built with

```sh
npm run build:demo
```

### Lints and fixes files

```sh
npm run lint
```
