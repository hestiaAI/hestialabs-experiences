<p align="center">
  <img alt="HestiaLabs" src="https://hestialabs.org/assets/img/hestialabs-logo+text.svg" width="480">
</p>

<br>

<p align="center">
  <a href="https://lerna.js.org/"><img alt="Lerna" src="https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg"></a>
</p>

# Instructions

Read the following instructions carefully before getting started.

## Setup

Install all packages

```sh
npm install
```

## Development

Run the following script to start developing:

```sh
npm run dev
```

This runs webpack in watch mode, building the packages once and then watching all files for changes. If one file is updated, the code is recompiled so you don’t have to run the full build manually.

## Build

Run the following script to build all packages manually:

```sh
npm run build
```

## Package management

This section explains how packages are created and updated

### Create a new package

1. Create a new folder in the `packages` directory. The folder name will be the package name.

2. Add a `src` folder with the required `index.ts` entry file.

3. Add a `package.json` that looks like this:

```json
{
  "name": "@hestiaai/<NAME>",
  "version": "0.0.0",
  "description": "",
  "main": "dist/index",
  "files": ["dist"],
  "repository": {
    "type": "git",
    "url": "https://github.com/hestiaai/hestialabs",
    "directory": "packages/<NAME>"
  },
  "publishConfig": {
    "access": "public"
  },
  "author": "",
  "license": "ISC"
}
```

Replace `<NAME>` with the name of the package.

### Authenticate to GitHub Packages

Follow these instructions to authenticate to GitHub Packages with a personal access token (PAT).

1. [Create a PAT](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token). Select the scopes (permissions) `write:packages` and `delete:packages`.

2. [Authenticate](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-with-a-personal-access-token). The simplest recommended way is to add your PAT to your `~/.npmrc` file:

```
//npm.pkg.github.com/:_authToken=TOKEN
```

### Bump version of packages changed since the last release

```sh
npm run lerna:version
```

[Documentation of lerna’s `version` command](https://github.com/lerna/lerna/tree/main/commands/version)

You can pass extra arguments to the npm script:

```sh
npm run lerna:version -- --no-push
```

### Publish packages

```sh
npm run lerna:publish
```

[Documentation of lerna’s `publish` command](https://github.com/lerna/lerna/tree/main/commands/publish)

# Sources

- [Lerna documentation](https://github.com/lerna/lerna)
- [Working with the npm registry - GitHub Docs](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry)

# Caveats

- Passing arguments from the command line to npm scripts works in PowerShell if you [enclose the `--` in quotation marks](https://stackoverflow.com/a/65530483/8238129). For example,

```sh
$ npm run lerna:version "--" --force-publish
```
