import localforage from 'localforage'

async function getItem(key, name = 'root') {
  try {
    const store = localforage.createInstance({ name })
    const value = await store.getItem(key)
    return value
  } catch (err) {
    console.error(err)
  }
}
async function setItem(key, value, name = 'root') {
  try {
    const store = localforage.createInstance({ name })
    await store.setItem(key, value)
  } catch (err) {
    console.error(err)
  }
}

export default {
  getItem,
  setItem
}
