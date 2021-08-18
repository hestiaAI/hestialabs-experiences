import sha1 from 'sha1'

const prefix = 'http://www.example.com/'

const functions = {
  dateTimeAddTimeChar: ([input]) => input.replace(' ', 'T'),
  sha1: ([input]) => sha1(input)
}

export default Object.fromEntries(
  Object.entries(functions).map(([k, v]) => [`${prefix}${k}`, v])
)
