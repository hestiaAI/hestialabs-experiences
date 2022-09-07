import {
  TypeChecker
} from '~/utils/type-check'

import { dateFormatter } from '@/utils/dates'
import { arrayEqualNoOrder } from '~/utils/test-utils'

const typeChecker = new TypeChecker()

test('getNotNullSampleFromData gives unique row samples', () => {
  const TEST_ROWS = [
    { id: 0, description: 'hello world', time: '2021-12-31', ratio: 0.5 },
    { id: 1, description: 'foo bar', time: '2022-01-01', ratio: 0.33 },
    { id: 2, description: 'hello world', time: '2021-12-31', ratio: 0.5 },
    { id: 3, description: 'foo bar', time: '2022-01-01', ratio: 0.33 },
    { id: 4, description: 'hello world', time: '2021-12-31', ratio: 0.5 },
    { id: 5, description: 'foo bar', time: '2022-01-01', ratio: 0.33 }
  ]

  const TEST_HEADERS = Object.keys(TEST_ROWS[0])
  const sample = typeChecker.getNotNullSampleFromData(
    TEST_HEADERS,
    TEST_ROWS,
    TEST_ROWS.length
  )

  arrayEqualNoOrder(typeChecker.objectToDataFrame(sample), TEST_ROWS)
})

test('getNotNullSampleFromData works if sample size is not in bounds', () => {
  const TEST_ROWS = [
    { id: 0, description: 'hello world', time: '2021-12-31', ratio: 0.5 },
    { id: 1, description: 'foo bar', time: '2022-01-01', ratio: 0.33 },
    { id: 2, description: 'hello world', time: '2021-12-31', ratio: 0.5 },
    { id: 3, description: 'foo bar', time: '2022-01-01', ratio: 0.33 },
    { id: 4, description: 'hello world', time: '2021-12-31', ratio: 0.5 },
    { id: 5, description: 'foo bar', time: '2022-01-01', ratio: 0.33 }
  ]

  const TEST_HEADERS = Object.keys(TEST_ROWS[0])
  let sample = typeChecker.getNotNullSampleFromData(
    TEST_HEADERS,
    TEST_ROWS,
    TEST_ROWS.length + 50
  )

  arrayEqualNoOrder(typeChecker.objectToDataFrame(sample), TEST_ROWS)

  sample = typeChecker.getNotNullSampleFromData(TEST_HEADERS, TEST_ROWS, -1)
  expect(Object.values(sample).every(e => e.length === 0)).toBeTruthy()
})

test('getNotNullSampleFromData skip null values', () => {
  const TEST_ROWS = [
    { id: 0, description: '', time: '', ratio: 0.5 },
    { description: 'hello 1', time: '', ratio: 0 },
    { id: '', description: 'None', time: '' },
    { id: '3', description: 'Hello 2', time: '' },
    { id: 'NaN', description: '', time: '2021-12-31', ratio: NaN },
    { id: null, description: '', time: '2022-01-01', ratio: NaN }
  ]
  const TEST_HEADERS = Object.keys(TEST_ROWS[0])

  const sample = typeChecker.getNotNullSampleFromData(TEST_HEADERS, TEST_ROWS, 2)
  const expected = {
    id: [0, '3'],
    description: ['hello 1', 'Hello 2'],
    time: ['2021-12-31', '2022-01-01'],
    ratio: [0, 0.5]
  }

  Object.keys(sample).forEach(h => arrayEqualNoOrder(sample[h], expected[h]))
})

test('getTypesFromData gives correct type', () => {
  const TEST_SAMPLE = {
    id: ['0', '3'],
    description: ['hello 1', 'Hello 2'],
    time: ['2021-12-31', '2022-01-01'],
    ratio: [0, '0.5', 0.3, '0.5', 0.3],
    boolean: [true, 'False', 'FALSE', 'TRUE', 0]
  }
  const TEST_HEADERS = Object.keys(TEST_SAMPLE).map((value) => {
    return { value }
  })
  const types = typeChecker.getTypesFromData(TEST_HEADERS, typeChecker.objectToDataFrame(TEST_SAMPLE))

  const expected = [
    { value: 'id', type: 'INT', category: 'MEASURE' },
    {
      value: 'description',
      type: 'STRING',

      category: 'DIMENSION'
    },
    { value: 'time', type: 'DATE', category: 'TIME' },
    { value: 'ratio', type: 'FLOAT', category: 'MEASURE' },
    {
      value: 'boolean',
      type: 'BOOLEAN',

      category: 'DIMENSION'
    }
  ]
  arrayEqualNoOrder(types, expected)
})

test('formatDataWithTypes convert to valid format', () => {
  const TEST_HEADERS = [
    { value: 'id', type: 'INT', category: 'MEASURE' },
    {
      value: 'description',
      type: 'STRING',

      category: 'DIMENSION'
    },
    { value: 'time', type: 'DATE', category: 'TIME' },
    { value: 'ratio', type: 'FLOAT', category: 'MEASURE' },
    {
      value: 'boolean',
      type: 'BOOLEAN',

      category: 'DIMENSION'
    }
  ]
  const TEST_SAMPLE = [
    { id: 0, description: '', time: '', ratio: 0.5, boolean: 'TRUE' },
    { description: 'hello 1', time: '', ratio: 0, boolean: 'True' },
    { id: '', description: 'None', time: '', boolean: true },
    { id: '3', description: 'Hello 2', time: '', boolean: 0 },
    { id: 'NaN', description: '', time: '2021-12-31', ratio: NaN },
    { id: null, description: '', time: '2022-01-01', ratio: NaN }
  ]

  const result = typeChecker.formatDataWithTypes(TEST_HEADERS, TEST_SAMPLE)

  const expected = [
    {
      id: 0,
      description: null,
      time: null,
      ratio: 0.5,
      boolean: true
    },
    {
      description: 'hello 1',
      time: null,
      ratio: 0,
      boolean: true,
      id: NaN
    },
    {
      id: NaN,
      description: 'None',
      time: null,
      boolean: true,
      ratio: NaN
    },
    {
      id: 3,
      description: 'Hello 2',
      time: null,
      boolean: false,
      ratio: NaN
    },
    {
      id: NaN,
      description: null,
      time: dateFormatter(new Date('2021-12-31')),
      ratio: NaN,
      boolean: null
    },
    {
      id: NaN,
      description: null,
      time: dateFormatter(new Date('2022-01-01')),
      ratio: NaN,
      boolean: null
    }
  ]

  arrayEqualNoOrder(result, expected)
})

test('detectTypes return the correct headers and values', () => {
  const TEST_SAMPLE = [
    { id: 0, description: '', time: '', ratio: 0.5, boolean: 'TRUE' },
    { description: 'hello 1', time: '', ratio: 0.1, boolean: 'True' },
    { id: '', description: 'None', time: '', boolean: true },
    { id: '3', description: 'Hello 2', time: '', boolean: 0 },
    { id: 'NaN', description: '', time: '2021-12-31', ratio: NaN },
    { id: null, description: '', time: '2022-01-01', ratio: NaN }
  ]
  const TEST_HEADERS = Object.keys(TEST_SAMPLE[0]).map((value) => {
    return { value }
  })
  const result = typeChecker.detectTypes(TEST_HEADERS, TEST_SAMPLE)

  const expected = {
    headers: [
      { value: 'id', type: 'INT', category: 'MEASURE' },
      {
        value: 'description',
        type: 'STRING',
        category: 'DIMENSION'
      },
      {
        value: 'time',
        type: 'DATE',
        category: 'TIME'
      },
      { value: 'ratio', type: 'FLOAT', category: 'MEASURE' },
      {
        value: 'boolean',
        type: 'BOOLEAN',
        category: 'DIMENSION'
      }
    ],
    items: [
      { id: 0, description: null, time: null, ratio: 0.5, boolean: true },
      {
        description: 'hello 1',
        time: null,
        ratio: 0.1,
        boolean: true,
        id: NaN
      },
      {
        id: NaN,
        description: 'None',
        time: null,
        boolean: true,
        ratio: NaN
      },
      {
        id: 3,
        description: 'Hello 2',
        time: null,
        boolean: false,
        ratio: NaN
      },
      {
        id: NaN,
        description: null,
        time: dateFormatter(new Date('2021-12-31')),
        ratio: NaN,
        boolean: null
      },
      {
        id: NaN,
        description: null,
        time: dateFormatter(new Date('2022-01-01')),
        ratio: NaN,
        boolean: null
      }
    ]
  }
  arrayEqualNoOrder(result.headers, expected.headers)
  arrayEqualNoOrder(result.items, expected.items)
})
