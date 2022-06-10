class Api {
  constructor($axios) {
    this.$axios = $axios
  }

  async getConfig(bubbleName) {
    try {
      const { status, data } = await this.$axios.get(
        `/bubbles/${bubbleName}/config`
      )
      if (status >= 400) {
        throw new Error(`Axios error, status: ${status}`)
      }
      return data
    } catch (err) {
      console.error(err)
    }
  }

  getFilenames(bubbleName, callback) {
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

  getFile(bubbleName, filename, callback) {
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

  async deleteFiles(bubble, password) {
    const formData = new FormData()
    formData.append('password', password)
    let errorMessage
    try {
      const resp = await fetch(
        `${process.env.apiUrl}/bubbles/${bubble}/delete-files`,
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

  async uploadFile(file, destinationBubble, sourceBubble, password) {
    const formData = new FormData()
    formData.append('password', password)
    formData.append('source-bubble', sourceBubble)
    formData.append('file', file, file.name)
    let errorMessage
    try {
      const resp = await fetch(
        `${process.env.apiUrl}/bubbles/${destinationBubble}/files`,
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
}

export default ({ $axios }, inject) => {
  const api = new Api($axios)
  inject('api', api)
}
