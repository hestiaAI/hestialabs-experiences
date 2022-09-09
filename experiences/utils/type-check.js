import { Analyzer, DATA_TYPES } from 'type-analyzer'
import { shuffle } from 'lodash-es'
import {
  isValidDate,
  dateFormatter,
  datetimeFormatter,
  timeFormatter
} from '@/utils/dates'

// Number of sample to use for the type analysis
const NB_SAMPLE = 400

// Define the allowed detected types, the lower it is, the better the performance of the type check.
const ACCEPTED_TYPES = [
  DATA_TYPES.BOOLEAN,
  DATA_TYPES.FLOAT,
  DATA_TYPES.INT,
  DATA_TYPES.OBJECT,
  DATA_TYPES.ARRAY,
  DATA_TYPES.DATE,
  DATA_TYPES.DATETIME,
  DATA_TYPES.STRING
]

// Define the possible null values we can encounter to exclude them from the type analysis
const NULL_VALUES = /^(null|nan|none||)$/i
const BOOLEAN_VALUES = /^(true|1|on|yes|false|0|off|no)/i
const TRUE_VALUES = /^(true|1|on|yes)/i

// Define Formatters in order to format all columns with the given type
const TYPE_FORMATTER = {
  BOOLEAN: {
    validator: d => BOOLEAN_VALUES.test(String(d)),
    formatter(d) {
      return typeof d === 'undefined'
        ? null
        : this.vue.$t(String(TRUE_VALUES.test(String(d))))
    }
  },
  FLOAT: {
    validator: d => !isNaN(parseFloat(d)),
    formatter: d => parseFloat(d)
  },
  INT: {
    validator: d => Number.isInteger(Number(d)),
    formatter: d => parseInt(d)
  },
  OBJECT: {
    validator: d => typeof d === 'object',
    formatter: d => JSON.stringify(d) ?? null
  },
  ARRAY: {
    validator: d => Array.isArray(d),
    formatter: d => JSON.stringify(d) ?? null
  },
  DATE: {
    validator: d => !isNaN(new Date(d).getTime()),
    formatter: (d) => {
      const date = new Date(d)
      return isValidDate(date) ? dateFormatter(date) : null
    }
  },
  DATETIME: {
    validator: d => !isNaN(new Date(d).getTime()),
    formatter: (d) => {
      const date = new Date(d)
      return isValidDate(date) ? datetimeFormatter(date) : null
    }
  },
  TIME: {
    validator: d => true, // TODO: validate time
    formatter: (d) => {
      const date = new Date(d)
      return isValidDate(date) ? timeFormatter(date) : null
    }
  },
  STRING: {
    validator: d => true, // String is our fallback solution, so no validation here
    formatter: d => (d ? String(d) : null)
  }
}

export class TypeChecker {
  constructor(vue) {
    this.vue = vue || { $t: d => d }
  }

  /**
   * Get a random sample of unique, not null values for each columns defined in @headers
   * Garanty to find @nbSamples not null samples except if there is not enought rows
   * satisfying the not null condition.
   * @param {Array} headers the columns name for which we want sample data
   * @param {Array[Object]} items an array of rows represented by Objects
   * @param {Number} nbSamples the number of samples to retrieve
   * @returns {Object} an object containing the list of samples retrieved for each column name.
   */
  getNotNullSampleFromData(headers, items, nbSamples) {
    const totalSamples = Math.min(
      items.length,
      nbSamples > 0 ? Math.floor(nbSamples) : 0
    )
    const randomIdxs = shuffle(
      Array(items.length)
        .fill()
        .map((item, idx) => idx)
    )
    const samples = {}
    headers.forEach((h) => {
      let idx = 0
      samples[h] = []

      while (samples[h].length < totalSamples) {
        if (idx >= randomIdxs.length) {
          break
        }
        const value = items[randomIdxs[idx]][h] ?? null
        if (!NULL_VALUES.test(String(value))) {
          samples[h].push(value)
        }
        idx++
      }
    })
    return samples
  }

  /**
   * Convert an object of the form {key1: arr1, key2: arr2} to the form
   * [{key1: arr1[0], key2: arr2[0]}, {key1: arr1[1], key2: arr2[2]}, ... ]
   * @param {*} object an object with keys associated to arrays
   * @returns an array of rows object
   */
  objectToDataFrame(object) {
    return Object.keys(object).reduce((r, k) => {
      object[k].forEach((a, i) => {
        r[i] = r[i] || {}
        r[i][k] = a
      })
      return r
    }, [])
  }

  /**
   * Try to infer the types of each column in the given array of items
   * @param {*} items an array of rows object (e.g: [{key1: arr1[0], key2: arr2[0]}, {key1: arr1[1], key2: arr2[2]}, ... ])
   * @returns a list of headers with additional metadata about type of each column
   */
  getTypesFromData(headers, items) {
    const ignoredDataTypes = Object.keys(DATA_TYPES).filter(
      type => !ACCEPTED_TYPES.includes(type)
    )

    const meta = Analyzer.computeColMeta(items, [], {
      ignoredDataTypes
    })

    return meta.map((m) => {
      const header = headers.find(h => h.value === m.label)
      return {
        value: m.label,
        type: m.type,
        category: m.category,
        ...header // if type is already defined in header, it overwrite the predicted one
      }
    })
  }

  /**
   * Apply a formatter to each columns with the type detected
   * @param {Array[Object]} headers metadata for the headers, with type detected
   * @param {Array[Object]} items rows to be formatted
   * @returns the formatted rows with the correct type
   */
  formatDataWithTypes(headers, items) {
    return items.map((r) => {
      headers.forEach((h) => {
        const formatter = TYPE_FORMATTER[h.type]?.formatter ?? (d => d)
        // call the formatter with 'this' set as the TypeChecker instance
        r[h.value] = formatter.call(this, r[h.value])
      })
      return r
    })
  }

  /**
   * Verify that the inferred type is valid for the first non null value,
   * otherwise fallback to string type
   * @param {Array[Object]} headers metadata for the headers, with type detected
   * @param {Array[Object]} items rows to be verify
   * @returns the headers with types changed to  string when not validated
   */
  verifyTypes(headers, items) {
    headers.forEach((h) => {
      const validator = TYPE_FORMATTER[h.type].validator
      let idxRow = 0

      // Iterate through all rows to find the first non null value
      while (idxRow < items.length) {
        const value = items[idxRow][h.value]

        // if the current value is null go to next row
        if (NULL_VALUES.test(String(value))) {
          idxRow++
          continue
        }
        // else if the value is valid, we assume the type was correctly detected, stop iterations
        if (validator(value)) {
          break
        }

        // else we assume that the type was falsy detected and set the type to default String
        h.type = 'string'
        break
      }
      if (idxRow === items.length) {
        h.type = 'string'
      }
    })
    return headers
  }

  /**
   * Infer types of data and convert items to the proper type
   * @param {Array} headers a list of columns name to handle
   * @param {Array[Object]} items an array of objects representing rows
   * @returns the headers array with metadata about inferred type and the items casted to the inferred type
   */
  detectTypes(headers, items) {
    const columnNames = headers.map(h => h.value)
    const samples = this.getNotNullSampleFromData(columnNames, items, NB_SAMPLE)
    const metadata = this.getTypesFromData(headers, this.objectToDataFrame(samples))
    const typedHeaders = this.verifyTypes(metadata, items)
    const formattedItems = this.formatDataWithTypes(typedHeaders, items)

    return { headers: typedHeaders, items: formattedItems }
  }
}
