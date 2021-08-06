# Instructions

Please read these instructions carefully.

## How to add a new data experience

1. Create a new folder in `manifests/` and give it a unique name matching the regular expression `[a-z-]+` (only lowercase ASCII characters and dashes are allowed). Note that this name will also be the slug (URL identifier) of the data experience.

2. Add `.json` config file

```js
{
  /**
    * Title of experience
    * @type String
    */
  "title": "Fancy Title",
  /**
    * Subtitle of experience
    * @type String
    */
  "subtitle": "Explanatory Subtitle",
  /**
    * URL to an icon
    * @type String
    */
  "icon": "https://icon-site.web/some-icon.jpg",
  /**
    * Comma-separated list of file extensions
    * @type String
    */
  "ext": "json,csv",
  /**
    * The list of files to extract from a zip archive
    * This property is required when "ext" includes "zip"
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
    * Reference to a preprocessor (see preprocessors.js)
    * @type String
    */
  "preprocessor": "twitter"
}
```

3. Add `.yml` file containing [YARRRML mappings](https://rml.io/yarrrml/)
