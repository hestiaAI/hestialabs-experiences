import { getCsvHeadersAndItems } from '~/utils/csv'

self.onmessage = async(message) => {
  const hitems = await getCsvHeadersAndItems(message.data)
  self.postMessage(hitems)
}
