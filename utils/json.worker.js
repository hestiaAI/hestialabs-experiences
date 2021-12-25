import itemifyJSON from '~/utils/json'

onmessage = message => postMessage(itemifyJSON(...message.data))
