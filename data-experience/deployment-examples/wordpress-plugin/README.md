# Deploying these plugins

## Upload plugins to wordpress

Zip the files in this folder and upload the zip to plugins in the [wordpress dashboard](https://themewaves.com/how-to-upload-plugin-to-wordpress/)

Alternatively, you can upload this folder to wordpress's plugin directory with [FTP](https://www.wonderplugin.com/wordpress-tutorials/how-to-manually-install-a-wordpress-plugin-via-ftp/)

This will create two wordpress plugins: **Data Experience** and **Data Experience Iframe** that can be activated on the admin's plugin page.

## Create a new page

Add content with the shortcodes **[dataexperience]** or **[dataexperience-iframe]**. By default this will show the uber-driver experience.

Attributes allow you to specify the version of dataexperience, the experience, and a bubble for uploads, and other things:

```
[dataexperience version="3.0.13" experience="twitter@3.3.1" bubble="live-participant" viewer-opts="https://raw.githubusercontent.com/digipower-academy/experience-viewer-options/main"]
```

```
[dataexperience-iframe version="latest" experience="apple-tracker@latest" bubble="demo-participant" viewer-opts="https://raw.githubusercontent.com/digipower-academy/experience-viewer-options/main" class="some-css-class" style="width:100%; height: 100vh"]
```

- version: you can set the version of data-experience that you access. Available versions are listed on [npm](https://www.npmjs.com/package/@hestia.ai/data-experience?activeTab=versions). If you don't set the version, your page will load the latest version. Note that it's currently not possible to set the version of the experience, so your page will be loading the latest experience.
- experience: see the list of available experiences [here](https://github.com/hestiaAI/hestialabs-experiences/tree/master/packages/packages/experiences). You can specify the latest version like this: "twitter@latest"
- bubble: if you specify a participant bubble, allows the user to upload his data to the bubble, if they have the password. If you specify an aggregator bubble, the user will be able to download and display the data from the bubble, if they have the password and the private key. The list of bubbles is [here](https://bubbles.hestialabs.org/bubbles/list). The experience will only work if it is included in the bubble. To see what experiences are in a bubble, either look at its json config (for example demo-participant's is at https://bubbles.hestialabs.org/bubbles/demo-participant/config), or look at digipower.academy, where bubbles are called [data spaces](https://digipower.academy/spaces).
- viewer-opts: an url where to get viewer.jsons from. Some viewer.json [examples](https://github.com/digipower-academy/experience-viewer-options).
- class: sets a css class on the iframe element (only dataexperience-iframe).
- style: sets a css style on the iframe element (only dataexperience-iframe).

## Iframe or not?

Without an iframe, the experience adapts its dimension to the page, but there the css of the website can interfere with the css used in experiences. Ideally the website's css would be corrected to avoid this.

To completely isolate expereriences from the website's css, you can use the iframe, however the size of the iframe will be fixed and when experiences gets bigger than the iframe an additional scrollbar will appear.

# Development

The plugin is based on this [tutorial](https://dev.to/workingwebsites/using-vue-in-wordpress-1b9l)

I used [InstantWP](https://instantwp.com/) to test this locally. On windows, remember to start it with Start-InstantWP.bat

## Run the example with a local build

In [data-experience.php](data-experience.php) **uncomment** this line

```php
  // wp_enqueue_script('daex_dataexp', 'http://localhost:8000/dist/DataExperience.umd.min.js');

```

and **comment** these two

```php
  wp_enqueue_script('daex_dataexp', 'https://cdn.jsdelivr.net/npm/@hestia.ai/data-experience@'
  .$dataexp_version.'/dist/DataExperience.umd.min.js');
```

Then build and run from the root of the data-experience project

```sh
cd ..
npm run build
python -m http.server
```
