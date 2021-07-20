const referenceFormulations = {
  json: 'jsonpath',
  csv: 'csv',
  xml: 'xpath'
}

export const sourceArraysToObjects = sources =>
  sources.map(
    (
      [
        key,
        access,
        iterator = '', // CSV files do not have iterators
        format = '' // can use
      ],
      defaultFormat = 'json'
    ) => {
      return {
        key,
        access,
        iterator,
        referenceFormulation: referenceFormulations[format || defaultFormat]
      }
    }
  )
