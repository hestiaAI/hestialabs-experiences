/* eslint-disable import/default */
// the workers are in a separate file
// so we can run tests with node
// that somehow can't deal with this syntax
// given by the worker-loader
// https://v4.webpack.js.org/loaders/worker-loader/
import CsvWorker from './csv.worker.js?worker&inline'
import JsonWorker from './json.worker.js?worker&inline'

export default { CsvWorker, JsonWorker }
