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
  "icon": "twittr.png",
  /**
    * Link to the data portal or the instructions for downloading the data (optional, recommended)
    * @type String
    */
  "dataPortal": "https://example.com/data-portal",
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
  "data": ["twitter.zip"],
  /**
    * Array defining the blocks to show in the default view. Each section section can have:
    * - A SPARQL query
    * - A function used as the custom pipeline (defined in pipeline.js)
    * - A SQL query
    * - A postprocessor (defined in postprocessors.js)
    * - A parameter name (if necessary), and for sql pipelines a parameter key used in the query (prefixed with :)
    * - Additional arguments to pass to a custom pipeline
    * - A visualization name
    * - Some props that will be passed to a vue viz
    * - A data table
    * - A title
    * - A text description
    * The files referenced should be in the 'main' example.
    * @type Array[Object]
    */
  "defaultView": [
    {
      "query": "sparql_query_filename",
      "customPipeline": "pipeline_function_name",
      "sql": "sql_query_filename",
      "postprocessor": "postprocessor_function_name",
      "parameterName": "Example",
      "parameterKey": ":example",
      "customPipelineOptions": { "example_1": "hello", "example_2": 42 },
      "visualization": "viz_name",
      "vizProps": {
        "example_1": "hello world",
        "example_2": 42
      },
      "showTable": false,
      "title": "An interesting title",
      "text": "Lorem ipsum."
    }
  ]
}
```

3. For the SPARQL pipeline: add a single YARRRML file at the root (a `.yml` or `.yaml` file containing [YARRRML mappings](https://rml.io/yarrrml/)), and the SPARQL queries in a subfolder `queries`. If needed, add custom RML functions to `manifests/functions.js`

**Note**
If the data experience involves a single non-zip file input, use the name `input.<ext>` in the YARRRML `access` field of the source definition.

4. For the SQL pipeline: add a `databaseBuilder` function in a file `database.js`, and the SQL queries in a subfolder `queries`.

5. For the custom pipeline: add the functions in a file `pipeline.js`.

6. If needed, add postprocessor functions in a file `postprocessors.js`.

7. If needed, add Vega configurations in a subfolder `visualizations`.

8. Import the all the functions from `*.js` files in a file `index.js` and export them as an object.

9. If the icon is not there yet, add the image file to `manifests/icons/`

## Adding sample data

Add sample data to the `/assets/data/` folder. Update the `data` array in the JSON config file of the relevant data experiences to make the new data file available. Additionally, the data sample is automatically added to the Playground.
