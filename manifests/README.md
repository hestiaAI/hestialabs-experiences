# Instructions

Please read these instructions carefully.

Note: All files and folders should match the following regular expression: [`^(?:[a-z0-9]+-?)+[a-z0-9]$`](https://regexr.com/63ncg)


## Adding new data experiences

1. Create a new folder in `/manifests/experiences/` and give it a unique name. Note that this name will also be the slug (URL identifier) of the data experience.

2. Add `.json` config file

```js
{
  /**
    * Title of experience (required)
    * @type String
    */
  "title": "Fancy Title",
  /**
    * Subtitle of experience (optional, recommended)
    * @type String
    * @default 'Data Experience'
    */
  "subtitle": "Explanatory Subtitle",
  /**
    * Icon file name (required)
    * @type String
    */
  "icon": "twitter.png",
  /**
    * Comma-separated list of allowed file extensions (required)
    * @type String
    */
  "ext": "json,csv,zip",
  /**
    * Array of relative paths to files to extract from a zip archive
    * (required when "ext" includes "zip", except the playground)
    * @type Array[String]
    * @default []
    */
  "files": ["data/ad-impressions.js"],
  /**
    * Can the user input multiple files?
    * @type Boolean
    * @default false
    */
  "multiple": false,
  /**
    * Reference to a preprocessor (optional, see preprocessors.js)
    * @type String
    */
  "preprocessor": "twitter",
	/**
    * Array of paths to sample data files in /assets/data/ (optional)
    * @type Array[String]
    * @default []
    */
  "data": ["twitter.zip"]
}
```

3. Create a subfolder `examples/`. This directory will contain all YARRRML and SPARQL examples, and needs to contain at the bare minimum a `main` example directory including the main YARRRML file. Selecting examples is only available to power users for development and testing purposes. When a general user uses the app, the `main` mapping is used.

4. Add a subdirectory `examples/main/` and add to it the main `.yml` (or `.yaml`) file containing [YARRRML mappings](https://rml.io/yarrrml/).

**Note**
If the data experience involves a single non-zip file input, use the name `input.<ext>` in the YARRRML `access` field of the source definition.

5. If needed, add custom functions to [`functions.js`](https://github.com/hestiaAI/hestia-rml-demo/edit/master/manifests/functions.js)

6. If the icon is not there yet, add the image file to `manifests/icons/`

## Adding sample data

Add sample data to the `/assets/data/` folder. Update the `data` array in the JSON config file of the relevant data experiences to make the new data file available. Additionally, the data sample is automatically added to the Playground.


## Adding new examples for power users

Add a folder to the `examples` folder of the experience. The name of the folder corresponds to the name of the example. Add a single `yml`/`yaml` file with the example YARRRML. Add zero or more `.rq` files containing SPARQL query samples.
