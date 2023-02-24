/* eslint-disable import/first */
// This might disable the papaparse worker in the
// next papaparse version
// https://github.com/mholt/PapaParse/issues/970
self.IS_PAPA_WORKER = false
import { getCsvHeadersAndItems } from './csv'

self.onmessage = async(message) => {
  const hitems = await getCsvHeadersAndItems(message.data)
  self.postMessage(hitems)
}
