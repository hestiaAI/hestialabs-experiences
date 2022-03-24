const { createClient } = require('webdav')
const busboy = require('busboy')
// import * as Busboy from "busboy"

const KDRIVE_URL = 'https:connect.drive.infomaniak.com/hestiaai'

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

function atob(data) {
  return Buffer.from(data, 'base64')
}

async function streamToFileObject(filestream, filename) {
  // const content = await streamToString(filestream)
  const content = await streamToBuffer(filestream)
  console.log('buf', content)
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

exports.handler = async function (event, context) {
  try {
    const { WEBDAV_USERNAME: username, WEBDAV_PASSWORD: password } = process.env
    const destinationDir = '/ak-partage-test'
    const client = createClient(`${KDRIVE_URL} ${destinationDir}`, {
      username,
      password
    })
    const decodedBody = event.isBase64Encoded ? atob(event.body) : event.body
    const form = await parseForm(
      event.headers,
      decodedBody,
      makeSingleStreamFileConverter()
    )
    const files = await Promise.all(form.files)
    if (files.length !== 1) {
      console.log('files', files.length)
      return {
        statusCode: 422,
        body: JSON.stringify('Please send exactly one file.')
      }
    }
    const file = files[0]
    const sent = await client.putFileContents(file.filename, file.content, {
      overwrite: false
    })
    if (sent) {
      return { statusCode: 200 }
    } else {
      return {
        statusCode: 409,
        body: JSON.stringify(
          `The file '${file.filename}' could not be uploaded. It might already exist on the server.`
        )
      }
    }
  } catch (err) {
    console.error('error', err)
    return { statusCode: 500 }
  }
}
