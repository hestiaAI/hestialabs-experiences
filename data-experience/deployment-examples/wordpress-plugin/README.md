# Deploying this plugin

## Upload plugin to wordpress

Zip the files in this folder and upload the zip to plugins in the [wordpress dashboard](https://themewaves.com/how-to-upload-plugin-to-wordpress/)
https://themewaves.com/how-to-upload-plugin-to-wordpress/

Alternatively, you can upload this folder to wordpress's plugin directory with [FTP](https://www.wonderplugin.com/wordpress-tutorials/how-to-manually-install-a-wordpress-plugin-via-ftp/)

## Create a new page

Add content with the shortcode [dataexperience]. By default this will show the uber-driver experience.

Attributes allow you to specify the version of dataexperience, the experience, and a bubble for uploads:

```
[dataexperience version="2.0.12" experience="twitter" bubble="live-participant"]
```

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
