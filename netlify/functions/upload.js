const { createClient } = require('webdav')
const busboy = require('busboy')

const KDRIVE_URL = 'https:connect.drive.infomaniak.com/hestiaai'
// https://functions.netlify.com/playground/#read-environment-variables
const { WEBDAV_USERNAME, WEBDAV_PASSWORD, BASE_URL } = process.env

function streamToBuffer(stream) {
  const chunks = []
  return new Promise((resolve, reject) => {
    stream.on('data', chunk => chunks.push(Buffer.from(chunk)))
    stream.on('error', err => reject(err))
    stream.on('end', () => resolve(Buffer.concat(chunks)))
  })
}

function parseForm(headers, body, readFilestream) {
  return new Promise((resolve, reject) => {
    const bb = busboy({ headers })
    const form = { fields: {}, files: [] }
    bb.on('file', (_fieldname, filestream, info) => {
      const { filename } = info
      // const { filename, encoding, mimeType } = info
      // console.log(
      //   `File [${_fieldname}]: filename: %j, encoding: %j, mimeType: %j`,
      //   filename,
      //   encoding,
      //   mimeType
      // )
      const fileHavingBeenRead = readFilestream(filestream, filename)
      if (fileHavingBeenRead) {
        form.files.push(fileHavingBeenRead)
      }
    })
    bb.on('field', (name, val, _info) => {
      form.fields[name] = val
      // console.log(`Field [${name}]: value: %j`, val)
    })
    bb.on('close', () => {
      // console.log('Done parsing form!', form)
      resolve(form)
    })
    bb.on('error', err => reject(err))
    bb.end(body)
  })
}

async function parseEventForm(event) {
  const decodedBody = event.isBase64Encoded ? atob(event.body) : event.body
  const formWithFilePromises = await parseForm(
    event.headers,
    decodedBody,
    makeSingleStreamFileConverter()
  )
  const files = await Promise.all(formWithFilePromises.files)
  return Object.assign(formWithFilePromises, { files })
}

function atob(data) {
  return Buffer.from(data, 'base64')
}

async function streamToFileObject(filestream, filename) {
  const content = await streamToBuffer(filestream)
  return { content, filename }
}

function makeSingleStreamFileConverter() {
  let oneWasSent = false
  return async (filestream, filename) => {
    const object = await streamToFileObject(filestream, filename)
    if (oneWasSent) {
      return undefined
    }
    oneWasSent = true
    return object
  }
}

async function sendFile(file, parentDir, client) {
  const { filename, content } = file
  const path = parentDir ? `${parentDir}/${filename}` : filename
  const options = { overwrite: false }
  const sent = await client.putFileContents(path, content, options)

  if (sent) {
    console.log(`Sent file ${path}`)
    return { statusCode: 200 }
  } else {
    const message = `The file '${file.filename}' could not be uploaded. It might already exist on the server.`
    console.log(message)
    return { statusCode: 409, body: JSON.stringify(message) }
  }
}

async function createParentDirIfNeeded(client) {
  if (!BASE_URL) {
    return ''
  }
  const url = new URL(BASE_URL)
  const dir = url.hostname
  if (dir && (await client.exists(dir)) === false) {
    console.log('create directory', dir)
    await client.createDirectory(dir)
  }
  return dir
}

exports.handler = async function (event, context) {
  try {
    const destinationDir = '/Common documents/experience-user-uploads'
    const client = createClient(`${KDRIVE_URL} ${destinationDir}`, {
      username: WEBDAV_USERNAME,
      password: WEBDAV_PASSWORD
    })
    const form = await parseEventForm(event)
    const { fields, files } = form
    console.log('fields', fields)
    if (files.length !== 1) {
      return {
        statusCode: 422,
        body: JSON.stringify('Please send exactly one file.')
      }
    }
    // const parentDir = fields.experiencesHostName
    const parentDir = await createParentDirIfNeeded(client)
    return sendFile(files[0], parentDir, client)
  } catch (err) {
    const message = `Error sending to ${KDRIVE_URL} as ${WEBDAV_USERNAME}`
    if (err.response) {
      console.error(message)
      console.log(err.response?.data || err.response)
    } else {
      console.error(message, err)
    }
    return { statusCode: 500 }
  }
}
