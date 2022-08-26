# turn TheDataExperience into a library 

The nuxt app in project **experiences** should import **TheDataExperience.vue** from project **data-experience**

looks like the store needs to be refactored
experiences needs to be at top level
each experience needs to have it's own vue store
maybe we could start by allowing only one experience
clearStore is called anytime the files are reloaded

## examples
nuxt multi-apps that share components and with vuex stores
<https://stackoverflow.com/questions/67737667/shared-stores-on-multi-applications-nuxt>

pure vue component library example
<https://itnext.io/create-a-vue-js-component-library-as-a-module-part-1-a1116e632751>
the same with vuex
<https://itnext.io/create-a-vue-js-component-library-part-2-c92a42af84e9>

[François&rsquo; attempt feat/packageExperience](https://github.com/hestiaAI/hestialabs-experiences/tree/feat/packageExperience)

integrate router
<https://stackoverflow.com/questions/56484704/how-to-use-router-push-inside-a-vuejs-component>

vuetify&#x2026;
<https://stackoverflow.com/questions/61019454/vue-library-with-vuetify-dependencies>

# experiences imports data-experience

Experiences has a dependency to data-experience, a plain vue project created with vue-cli.

    cd experiences
    npm install ../data-experience

To test the current imports

    npm run dev
  
and open http://localhost:3000/modul

DummyButton works with vuex and is successfully imported to  nuxt thanks to the plugin *experiences/plugins/data-experiences.js*

Vuetify elements in the imported charts are not rendered

Importing from a normal vuetify project like vtfcomponent also fails. 

Next step is trying to import from a project made to export extended vuetify components (vuetify-extra)

## importing vuetify-extra

A vue project needs a [plugin to import vuetify-extra](https://github.com/menteora/vuetify-extra#use-plugin) (see example vextra)

A nuxt project installs plugins in a [module](https://nuxtjs.org/docs/directory-structure/modules/#provide-plugins)

Here's where [nuxt/vuetify](https://github.com/nuxt-community/vuetify-module/blob/8b52b9374ac059a4529635fcd8c96af955d84ea2/src/build.ts#L56) does it. It installs a plugin made specifically for nuxt using its template language and  compiles things with webpack/sass/whatever [:-/](https://github.com/nuxt-community/vuetify-module/blob/master/templates/plugin.js)

## importing vuetify projects fails

vtfcomponent vtfw4 are new projects created by vue-cli. Vtfw4 is created by an older version of vue-cli and uses webpack 4. 

Importing from these repos to experiences does not work.

<https://vuetifyjs.com/en/getting-started/installation/>
npm install -g @vue/cli

vue create vtfcomponent

-   Vue 2 babel, eslint

cd vtfcomponent
vue add vuetify

-   vuetify 2 - vue cli

npm ls webpack
! this vue cli uses webpack 5. Retry with webpack 4
most recent vue-cli version with webpack 4 is v4.5.7
according to history of package.json and git tags
9136696197b1da4a88700ead1ee78f02b40dc1a9 of vue-cli

npm uninstall -g @vue/cli
npm install -g @vue/cli@4.5.7

vue create vtfw4

-   Vue 2 babel, eslint

cd vtfw4
vue add vuetify

-   vuetify 2 - vue cli


# vextra imports  [vuetify-extra](https://github.com/menteora/vuetify-extra)

Vuetify-extra has vuetify as a dependency and exports new components. A copy of the code is in folder @menteora/vuetify-extra

Vextra is a vuetify project created by vue-cli that imports a component from vuetify-extra

If found vuetify-extra thanks to this [stackoverflow question](https://stackoverflow.com/questions/57577125/how-to-create-my-own-component-library-based-on-vuetify)

## local version of vuetify-extra

    git clone https://github.com/menteora/vuetify-extra.git @menteora/vuetify-extra
    cd vuetify-extra
    git checkout v0.3.2
    rm -rf .git
    npm run build

apparently package.json has incompatible dependencies, but package-lock.json is ok

I converted package-lock.json back to package.json with <https://pravnyadv.github.io/unpackage/>
(only used dependencies)


## create vuetify project vextra

    vue create vextra
    cd vextra
    vue add vuetify


## npm install: works (this is what we should be doing)

    cd vextra
    npm install  @menteora/vuetify-extra@0.3.2

set up the vuetify-extra plugin [as documented](https://github.com/menteora/vuetify-extra#use-plugin)

add a component from vuetify-extra: loginform

    npm run serve

this works


## dependency on sibling: failures and bad solutions

workspaces fail
npm add ../@menteora/vue-extra fails

Copying project into node<sub>modules</sub> FUCKING WORKS ??!!!
rm -rf node<sub>modules</sub>/@menteora/vuetify-extra
cp -r ../@menteora/vue-extra node<sub>modules</sub>/@menteora/


## npm link works if you delete node<sub>modules</sub> !?! (crazy workaround)

setting up the link

    cd @menteora/vuetify-extra
    # do a build and copy dist and package.json to ../linkable
    npm run build:linkable
    cd ../linkable
    npm link
    
    cd ../../vextra
    npm install
    # needs to be done after install (who would delete it)
    npm link @menteora/vuetify-extra
    
    # check it's pointing to the right place
    ls -l node_modules/@menteora/vuetify-extra
    ls -l node_modules/@menteora/vuetify-extra/
    
    npm run serve

update vuetify-extra with

    # in @menteora/vuetify-extra
    npm run build:linkable

after any npm install in vextra, relink to vuetify-extra

    # in vextra
    npm link @menteora/vuetify-extra
