# Deploying this plugin

## Upload plugin to wordpress

Zip the files in this folder and upload the zip to plugins in the [wordpress dashboard](https://themewaves.com/how-to-upload-plugin-to-wordpress/)

Alternatively, you can upload this folder to wordpress's plugin directory with [FTP](https://www.wonderplugin.com/wordpress-tutorials/how-to-manually-install-a-wordpress-plugin-via-ftp/)

## Create a new page

Add content with the shortcode [dataexperience]. By default this will show the uber-driver experience.

Attributes allow you to specify the version of dataexperience, the experience, and a bubble for uploads:

```
[dataexperience version="2.0.12" experience="twitter" bubble="live-participant"]
```

- version: you can set the version of data-experience that you access. If you don't set the version, your page will load the latest version. Note that it's currently not possible to set the version of the experience, so your page will be loading the latest experience.
- experience: see the list of available experiences [here](https://github.com/hestiaAI/hestialabs-experiences/tree/master/packages/packages/experiences)
- bubble: if you specify a participant bubble, allows the user to upload his data to the bubble, if they have the password. If you specify an aggregator bubble, the user will be able to download and display the data from the bubble, if they have the password and the private key. The list of bubbles is [here](https://bubbles.hestialabs.org/bubbles/list)

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
