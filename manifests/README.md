# Instructions

Please read these instructions carefully.

## How to add a new data experience

1. Create a new folder in `manifests/experiences/` and give it a unique name matching the regular expression `[a-z-]+` (only lowercase ASCII characters and dashes are allowed). Note that this name will also be the slug (URL identifier) of the data experience.

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
    */
  "subtitle": "Explanatory Subtitle",
  /**
    * URL to an icon (required)
    * @type String
    */
  "icon": "https://icon-site.web/some-icon.jpg",
  /**
    * Comma-separated list of allowed file extensions
    * @type String
    */
  "ext": "json,csv",
  /**
    * Array of paths of files to extract from a zip archive
    * (required when "ext" includes "zip")
    * @type Array
    * @default []
    */
  "files": [""],
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
    * Array of paths to sample data files (optional, see data folder)
    * @type Array[String]
    */
  "samples": ["twitter.zip"]
}
```

3. Add `.yml` (or `.yaml`) file containing [YARRRML mappings](https://rml.io/yarrrml/). This file is used when the user clicks on the "Use Preconstructed" button.
4. If needed, add custom functions to [`functions.js`](https://github.com/hestiaAI/hestia-rml-demo/edit/master/manifests/functions.js)
5. Add example data to the `manifests/data/` folder.
