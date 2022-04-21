// https://ajv.js.org/json-schema.html
import Ajv from 'ajv'

import { DatabaseConfig } from '@/types/experience-options'

const prefix = 'http://hestia.ai/schemas/databaseConfig.json#'

const tableNameSchema = {
  $id: `${prefix}tableName`,
  type: 'string',
  // PascalCase
  pattern: '^[A-Z][a-z]+(?:[A-Z][a-z]+)*$'
}

const columnSchema = {
  $id: `${prefix}column`,
  type: 'string',
  // camelCase
  pattern: '^[a-z]+(?:[A-Z][a-z]+)*$'
}

const columnsSchema = {
  $id: `${prefix}columns`,
  type: 'array',
  items: {
    $ref: '#column'
  }
}

const gettersSchema = {
  $id: `${prefix}getters`,
  type: 'array',
  minItems: 1,
  items: {
    type: 'object',
    properties: {
      column: {
        $ref: '#column'
      },
      fileId: {
        type: 'string'
      },
      getters: {
        $ref: '#getters'
      },
      options: {
        type: 'object',
        properties: {
          resultType: {
            enum: [
              'value',
              'path',
              'pointer',
              'parent',
              'parentProperty',
              'all'
            ]
          },
          callback: {
            type: 'string'
          }
        }
      },
      path: {
        type: 'string'
      },
      pathKey: {
        type: 'string'
      },
      queryRoot: {
        type: 'boolean'
      },
      reference: {
        type: 'object',
        properties: {
          table: {
            $ref: '#tableName'
          },
          column: {
            $ref: '#column'
          },
          autoincrementedId: {
            type: 'boolean'
          }
        },
        required: ['table', 'column']
      },
      table: {
        $ref: '#tableName'
      }
    },
    oneOf: [
      {
        required: ['column', 'path']
      },
      {
        required: ['column', 'pathKey']
      },
      {
        required: ['column', 'reference']
      },
      {
        required: ['getters', 'path', 'table']
      }
    ]
  }
}

const schema = {
  $id: prefix,
  type: 'object',
  properties: {
    tables: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        properties: {
          name: {
            type: 'string'
          },
          columns: {
            type: 'array',
            items: {
              type: 'array',
              minItems: 2,
              maxItems: 3,
              items: [
                { $ref: '#column' },
                { enum: ['INTEGER', 'TEXT', 'FLOAT', 'DATE'] },
                { type: 'string', pattern: '^[A-Z ]+$' }
              ]
            }
          },
          foreignKeys: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                columns: {
                  anyOf: [{ $ref: '#column' }, { $ref: '#columns' }]
                },
                reference: {
                  type: 'object',
                  properties: {
                    table: { $ref: '#tableName' },
                    columns: {
                      anyOf: [{ $ref: '#column' }, { $ref: '#columns' }]
                    }
                  },
                  required: ['table', 'columns']
                }
              }
            },
            required: ['columns', 'reference']
          }
        },
        required: ['name', 'columns']
      }
    },
    getters: {
      $ref: '#getters'
    }
  },
  required: ['tables', 'getters']
}

const ajv = new Ajv({
  allErrors: true,
  verbose: true,
  schemas: [tableNameSchema, columnSchema, columnsSchema, gettersSchema, schema]
})

export default function (experience: string, databaseConfig: DatabaseConfig) {
  console.info(`[${experience}] Validating databaseConfig JSON Schema...`)
  const valid = ajv.validate(prefix, databaseConfig)
  if (!valid) {
    const errors = JSON.stringify(ajv.errors, null, 2)
    throw new Error(
      `Invalid databaseConfig in ${experience} experience. Errors: ${errors}`
    )
  }
}
