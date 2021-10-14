# HestiaLabs Experiences

## Build Setup

```bash
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

## Global Configuration

The file `config/config.json` contains parameters that can be changed for each deployment:

```js
{
  /**
    * The name of the experiences to display (as defined in `/manifests/experiences/`).
    * @type Array
    */
  "experiences": ["facebook", "google", "twitter"],
  /**
    * Activate/deactivate the automatic local saving of data files, and show/hide the "cache" buttons.
    * @type Boolean
    */
  "saveFiles": false,
  /**
    * The public key used to encrypt the zip containing the consent log and results.
    * @type String
    */
  "publicKey": "29500a8814ffbfbb3fda7e9854ab8319e349dd50c1fe018ac342300d52f47626",
  /**
    * The content of the consent form. Each section has:
    * - A title
    * - A type (Either 'radio' or 'checkbox')
    * - An array of options
    * - A pre-selected answer (or an array of pre-selected answers in the case of checkboxes).
    *   Use an empty string or empty array for no pre-selection.
    * @type Array
    */
  "consent": [
    {
      "title": "Interesting title 1",
      "type": "radio",
      "options": ["A", "B", "C"],
      "selected": "A"
    },
    {
      "title": "Interesting title 2",
      "type": "checkbox",
      "options": ["A", "B", "C"],
      "selected": []
    },
  ]
}
```

If you want to use another configuration like `config/workshop.json` set the environment variable **CONFIG_NAME**

```bash
# for development
$ CONFIG_NAME=workshop npm run dev
```

```bash
# for production
CONFIG_NAME=workshop BASE_URL=experiences.hestialabs.org npm run build
# launch server
npm run start
```

## Special Directories

You can create the following extra directories, some of which have special behaviors. Only `pages` is required; you can delete them if you don't want to use their functionality.

### `assets`

The assets directory contains your uncompiled assets such as Stylus or Sass files, images, or fonts.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/assets).

### `components`

The components directory contains your Vue.js components. Components make up the different parts of your page and can be reused and imported into your pages, layouts and even other components.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/components).

### `layouts`

Layouts are a great help when you want to change the look and feel of your Nuxt app, whether you want to include a sidebar or have distinct layouts for mobile and desktop.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/layouts).

### `pages`

This directory contains your application views and routes. Nuxt will read all the `*.vue` files inside this directory and setup Vue Router automatically.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/get-started/routing).

### `plugins`

The plugins directory contains JavaScript plugins that you want to run before instantiating the root Vue.js Application. $7This is the place to add Vue plugins and to inject functions or constants. Every time you need to use `Vue.use()`, you should create a file in `plugins/` and add its path to plugins in `nuxt.config.js`.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/plugins).

### `static`

This directory contains your static files. Each file inside this directory is mapped to `/`.

Example: `/static/robots.txt` is mapped as `/robots.txt`.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/static).

### `store`

This directory contains your Vuex store files. Creating a file in this directory automatically activates Vuex.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/store).

## Upgrading npm on Windows

This is only relevant for Windows users who work with nvm.

We work with a version of npm more recent than the one shipped with the node LTS we are using. There is a standard way of upgrading npm, but it doesn't work with nvm-windows. The way to do it is described in this [comment on github](https://github.com/coreybutler/nvm-windows/issues/300#issuecomment-798776683):

- download [this](https://gist.github.com/nokidding/aafaf90adc80cbce54b676340817bb13) as updateNpm.bat file
- open powershell in that same folder and run this command ./updateNpm.bat latest
