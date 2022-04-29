# Instructions

Please read these instructions carefully.

Note: All files and folders should match the following regular expression: [`^(?:[a-z0-9]+-?)+[a-z0-9]$`](https://regexr.com/63ncg)

## Adding new data experiences

1. Create a new folder in `/manifests/experiences/` and give it a unique name. Note that this name will also be the slug (URL identifier) of the data experience.

2. Add `.json` config file (having the name of your experience, for example `some-company.json`)

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
    * The list of specific files that are used in the experiences. They are defined by an ID and a glob.
    * In the experiences, we should always refer to the ID of the files.
    * @type Object
    */
  "files": {"impressions": "**/data/ad-impressions.js"},
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
    * - key: A unique identifier for the block
    * - A function used as the custom pipeline (defined in pipeline.js)
    * - A SQL query
    * - A list of files required to run the experience. Refer to the IDs defined above.
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
  "viewBlocks": [
    {
      "key": "my-block",
      "customPipeline": "pipeline_function_name",
      "sql": "sql_query_filename",
      "files": ["file_id_1", "file_id_2"],
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

3. For the SQL pipeline: add a `databaseBuilder` function in a file `database.js`, and the SQL queries in a subfolder `queries`.

4. For the custom pipeline: add the functions in a file `pipeline.js`.

5. If needed, add postprocessor functions in a file `postprocessors.js`.

6. If needed, add Vega configurations in a subfolder `visualizations`.

7. Import all the functions from `*.js` files in a file `index.js` and export them as an object.

8. If the icon is missing add the image file to `manifests/icons/`

9. To display the experience on the website, its name needs to be added to the "experiences" array in the config you are using. Configs are found in folder `config`, by default `config/config.json` is used.

## Adding sample data

Add sample data to the `/assets/data/` folder. Update the `data` array in the JSON config file of the relevant data experiences to make the new data file available. Additionally, the data sample is automatically added to the Playground.
