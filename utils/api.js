export function getFilenames(bubbleName, callback) {
  const url = `${process.env.apiUrl}/bubbles/${bubbleName}/files`
  const options = { method: 'GET' }

  fetch(url, options)
    .then(res => {
      if (!res.ok) {
        throw new Error(
          `Unable to fetch filenames from server: Error ${res.status}`
        )
      }
      return res.json()
    })
    .then(json => callback(null, json))
    .catch(error => callback(error))
}

export function getFile(bubbleName, filename, callback) {
  const url = `${process.env.apiUrl}/bubbles/${bubbleName}/file/${filename}`
  const options = { method: 'GET' }

  fetch(url, options)
    .then(res => {
      if (res.ok) {
        res
          .blob()
          .then(blob => callback(null, blob))
          .catch(error => callback(error))
      } else {
        callback(
          new Error(
            `Unable to fetch ${filename} from server: Error ${res.status}`
          )
        )
      }
    })
    .catch(error => callback(error))
}
