import getCsvHeadersAndItems from '~/utils/csv'

onmessage = async message => {
  const hitems = await getCsvHeadersAndItems(message.data)
  postMessage(hitems)
}
