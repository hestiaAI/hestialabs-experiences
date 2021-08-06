import sha1 from 'sha1'

export default {
  'http://www.example.com/dateTimeAddTimeChar': ([input]) =>
    input.replace(' ', 'T'),
  'http://www.example.com/sha1': ([input]) => sha1(input)
}
