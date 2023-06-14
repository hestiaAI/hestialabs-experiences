export default class BubbleAPI {
  constructor(bubbleServerUrl) {
    this.apiUrl = bubbleServerUrl
  }

  async list() {
    const url = `${this.apiUrl}/bubbles/list`
    const options = { method: 'GET' }

    const res = await fetch(url, options)
    if (!res.ok) {
      throw new Error(
        `Unable to fetch bubble list from server: Error ${res.status}`
      )
    }
    return await res.json()
  }

  async getPlainConfig(bubbleName) {
    const url = `${this.apiUrl}/bubbles/${bubbleName}/config`
    const options = { method: 'GET' }

    const res = await fetch(url, options)
    if (!res.ok) {
      throw new Error(
        `Unable to fetch config from server: Error ${res.status}`
      )
    }
    const config = await res.json()
    return config
  }

  async getConfig(bubbleName) {
    const config = await this.getPlainConfig(bubbleName)
    config.getConsentForm = function(experienceSlug) {
      if (this.consent) {
        const consentFormExperience = this.consent[experienceSlug]
        if (consentFormExperience === null) {
          // consent form disabled for this experience
          return null
        }
        // fall back to the default form is consentFormExperience is undefined
        const cForm = consentFormExperience || this.consent.default
        const consentForm = cForm && JSON.parse(JSON.stringify(cForm))
        return consentForm
      }
      return null
    }
    return config
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

  async getFile(bubbleName, filename) {
    const url = `${this.apiUrl}/bubbles/${bubbleName}/file/${filename}`
    const options = { method: 'GET' }
    const res = await fetch(url, options)
    if (res.ok) {
      const blob = await res.blob()
      return blob
    } else {
      throw new Error(
              `Unable to fetch ${filename} from server: Error ${res.status}`
      )
    }
  }

  async login(id, codeword) {
    let errorMessage
    try {
      const resp = await fetch(
        `${this.apiUrl}/bubbles/login`,
        {
          method: 'POST',
          body: JSON.stringify({ id, codeword })
        }
      )
      if (resp.status === 403) {
        errorMessage =
            'You entered an incorrect codeword, please try again'
      } else if (!resp.ok) {
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
