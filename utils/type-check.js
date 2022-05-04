import { Analyzer, DATA_TYPES } from 'type-analyzer'
import _ from 'lodash'

// Number of sample to use for the type analysis
const NB_SAMPLE = 400

// Define the allowed detected types, the lower it is, the better the performance of the type check.
export const ACCEPTED_TYPES = [
  DATA_TYPES.BOOLEAN,
  DATA_TYPES.FLOAT,
  DATA_TYPES.INT,
  DATA_TYPES.OBJECT,
  DATA_TYPES.ARRAY,
  DATA_TYPES.DATE,
  DATA_TYPES.DATETIME,
  DATA_TYPES.TIME,
  DATA_TYPES.STRING
]

// Define the possible null values we can encounter to exclude them from the type analysis
export const NULL_VALUES = /^(null|nan|none||)$/i

// Define Formatters in order to format all columns with the given type
export const TYPE_FORMATTER = {
  BOOLEAN: {
    formatter: d => (typeof d === 'undefined' ? null : Boolean(d))
  },
  FLOAT: {
    formatter: d => parseFloat(d)
  },
  INT: {
    formatter: d => parseInt(d)
  },
  OBJECT: {
    formatter: d => JSON.stringify(d) ?? null
  },
  ARRAY: {
    formatter: d => JSON.stringify(d) ?? null
  },
  DATE: {
    formatter: d => {
      const date = new Date(d)
      return isNaN(date.getTime()) ? null : date
    }
  },
  DATETIME: {
    formatter: d => {
      const date = new Date(d)
      return isNaN(date.getTime()) ? null : date
    }
  },
  TIME: {
    formatter: d => {
      const date = new Date(d)
      return isNaN(date.getTime()) ? null : date
    }
  },
  STRING: {
    formatter: d => String(d) ?? ''
  }
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
export function getNotNullSampleFromData(headers, items, nbSamples) {
  const totalSamples = Math.min(
    items.length,
    nbSamples > 0 ? Math.floor(nbSamples) : 0
  )
  const randomIdxs = _.shuffle(
    Array(items.length)
      .fill()
      .map((item, idx) => idx)
  )
  const samples = {}
  headers.forEach(h => {
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
export function objectToDataFrame(object) {
  return Object.keys(object).reduce(function (r, k) {
    object[k].forEach(function (a, i) {
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
export function getTypesFromData(items) {
  const ignoredDataTypes = Object.keys(DATA_TYPES).filter(
    type => !ACCEPTED_TYPES.includes(type)
  )

  const meta = Analyzer.computeColMeta(items, [], {
    ignoredDataTypes
  })

  return meta.map(h => {
    return {
      value: h.label,
      type: h.type,
      format: h.format,
      category: h.category
    }
  })
}

export function formatDataWithTypes(headers, items) {
  return items.map(r => {
    headers.forEach(h => {
      const formatter = TYPE_FORMATTER[h.type]?.formatter ?? (d => d)
      r[h.value] = formatter(r[h.value])
    })
    return r
  })
}

/**
 * Infer types of data and convert items to the proper type
 * @param {Array} headers a list of columns name to handle
 * @param {Array[Object]} items an array of objects representing rows
 * @returns the headers array with metadata about inferred type and the items casted to the inferred type
 */
export function detectTypes(headers, items) {
  const samples = getNotNullSampleFromData(headers, items, NB_SAMPLE)
  const typedHeaders = getTypesFromData(objectToDataFrame(samples))
  const formattedItems = formatDataWithTypes(typedHeaders, items)

  return { headers: typedHeaders, items: formattedItems }
}
