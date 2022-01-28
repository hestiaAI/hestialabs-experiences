/**
 * This schema is a parsed json object in the JsonSchema syntax.
 * We're using the default syntax of https://ajv.js.org/
 * It is build to validate the options given to the custom pipeline
 * jsonToTableConverter
 */
export default {
  type: 'object',
  properties: {
    accessor: {
      type: 'object',
      properties: {
        filePath: {
          type: 'string' // Regex that match a set of files to scan
        },
        jsonPath: {
          type: 'string' // JSONPath to access a list of object in those files
        }
      },
      required: ['filePath', 'jsonPath']
    },
    // here we define the properties of each column
    columns: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          // name to display for the column
          name: {
            type: 'string'
          },
          // JSONPath to access the value (it can be nested or not)
          jsonPath: {
            type: 'string'
          }
        },
        required: ['name']
      }
    }
  },
  required: ['accessor']
}
