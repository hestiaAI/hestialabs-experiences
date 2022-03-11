/**
 * This schema is a parsed json object in the JsonSchema syntax.
 * We're using the default syntax of https://ajv.js.org/
 * It is build to validate the options given to the custom pipeline
 * jsonToTableConverter
 */
export default {
  type: 'array',
  items: {
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
      // here we configure columns
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
            path: {
              type: 'string'
            },
            // type of the value, allow to cast specific types
            type: {
              default: 'object',
              enum: ['string', 'date', 'number', 'object', 'list', 'boolean']
            },
            // format is required when the type is "date",
            // we use https://github.com/d3/d3-time-format to format dates
            format: {
              type: 'string'
            }
          },
          required: ['name', 'path', 'type'],
          anyOf: [
            {
              not: {
                properties: { type: { const: 'date' } }
              }
            },
            { required: ['format'] }
          ]
        }
      }
    },
    required: ['accessor']
  }
}
