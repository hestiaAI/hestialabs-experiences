/* eslint-disable no-empty */
import { PreprocessorFunction } from '@/types/experience-options'

// https://stackoverflow.com/q/17057407/8238129
function convertHexToString(input: string) {
  // split input into groups of two
  const hex = input.match(/[\s\S]{2}/g) || []
  let output = ''
  // build a hex-encoded representation of your string
  for (let i = 0, j = hex.length; i < j; i++) {
    output += '%' + ('0' + hex[i]).slice(-2)
  }
  // decode it using this trick
  output = decodeURIComponent(output)
  return output
}

const facebook: PreprocessorFunction = s => {
  // Facebook gives us messed up files (https://stackoverflow.com/q/52747566/8238129)
  // For instance the "é" character is encoded in UTF-8 as 0xc3 0xa9
  // But they give it as \u00c3\u00a9
  // To make it worse, unicode characters may have 2, 3, or 4 bytes
  const r = '\\\\u00([0-9a-f]{2})'
  // Successively try to replace characters with 2, 3, and 4 bytes
  // Can't use a loop because the number of arguments is variable
  s = s.replace(new RegExp(r + r, 'g'), (match, p1, p2) => {
    try {
      return convertHexToString(p1 + p2)
    } catch {}
    return match
  })
  s = s.replace(new RegExp(r + r + r, 'g'), (match, p1, p2, p3) => {
    try {
      return convertHexToString(p1 + p2 + p3)
    } catch {}
    return match
  })
  s = s.replace(new RegExp(r + r + r + r, 'g'), (match, p1, p2, p3, p4) => {
    try {
      return convertHexToString(p1 + p2 + p3 + p4)
    } catch {}
    return match
  })

  const json = JSON.parse(s)
  return JSON.stringify(json)
}

export default facebook
