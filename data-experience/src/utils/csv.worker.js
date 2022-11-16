import { getCsvHeadersAndItems } from './csv'

self.onmessage = async(message) => {
  const hitems = await getCsvHeadersAndItems(message.data)
  self.postMessage(hitems)
}
