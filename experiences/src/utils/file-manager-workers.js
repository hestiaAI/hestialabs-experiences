// the workers are in a separate file
// so we can run tests with node
// that somehow can't deal with this syntax
// given by the worker-loader
// https://v4.webpack.js.org/loaders/worker-loader/
import CsvWorker from '~/utils/csv.worker.js'
import JsonWorker from '~/utils/json.worker.js'

export default { CsvWorker, JsonWorker }
