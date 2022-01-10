import createItems from './file-parser'

onmessage = message => postMessage(createItems(message.data))
