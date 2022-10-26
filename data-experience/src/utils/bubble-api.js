export default class BubbleApi {
  constructor(bubbleServerUrl) {
    this.apiUrl = bubbleServerUrl
  }

  async getConfig(bubbleName) {
    const url = `${this.apiUrl}/bubbles/${bubbleName}/config`
    const options = { method: 'GET' }

    const res = await fetch(url, options)
    if (!res.ok) {
      throw new Error(
        `Unable to fetch config from server: Error ${res.status}`
      )
    }
    return await res.json()
  }

  getFilenames(bubbleName, callback) {
    const url = `${this.apiUrl}/bubbles/${bubbleName}/files`
    const options = { method: 'GET' }

    fetch(url, options)
      .then((res) => {
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

  getFile(bubbleName, filename, callback) {
    const url = `${this.apiUrl}/bubbles/${bubbleName}/file/${filename}`
    const options = { method: 'GET' }

    fetch(url, options)
      .then((res) => {
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

  async deleteFiles(bubble, codeword) {
    const formData = new FormData()
    formData.append('codeword', codeword)
    let errorMessage
    try {
      const resp = await fetch(
        `${this.apiUrl}/bubbles/${bubble}/delete-files`,
        {
          method: 'POST',
          body: formData
        }
      )
      if (!resp.ok) {
        console.error(resp)
        // use http status text in cas json() fails
        errorMessage = resp.statusText
        errorMessage = await resp.json()
      }
    } catch (error) {
      errorMessage = errorMessage || 'Error'
      console.error(error)
    }
    return errorMessage
  }

  async uploadFile(file, destinationBubble, sourceBubble, codeword) {
    const formData = new FormData()
    formData.append('codeword', codeword)
    formData.append('source-bubble', sourceBubble)
    formData.append('file', file, file.name)
    let errorMessage
    try {
      const resp = await fetch(
        `${this.apiUrl}/bubbles/${destinationBubble}/files`,
        {
          method: 'POST',
          body: formData
        }
      )
      if (!resp.ok) {
        console.error(resp)
        // use http status text in case json() fails
        const message403 = 'You entered an incorrect codeword, please try again'
        errorMessage = resp.status === 403 ? message403 : resp.statusText
      }
    } catch (error) {
      errorMessage = errorMessage || 'Error'
      console.error(error)
    }
    return errorMessage
  }
}
