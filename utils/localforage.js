import localforage from 'localforage'

function createInstance(name) {
  return localforage.createInstance({ name })
}

async function getItem(key, name) {
  return await createInstance(name).getItem(key)
}

async function setItem(key, value, name) {
  return await createInstance(name).setItem(key, value)
}

async function clear(...names) {
  await Promise.all(
    names.map((name) => {
      const store = createInstance(name)
      return store.clear()
    })
  )
}

const keyNames = ['processFilesResult']
const keys = Object.fromEntries(keyNames.map(k => [k, k]))

export default {
  getItem,
  setItem,
  clear,
  keys
}
