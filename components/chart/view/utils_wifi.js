function chunk(str, n) {
  const ret = []
  let i
  let len

  for (i = 0, len = str.length; i < len; i += n) {
    ret.push(str.substr(i, n))
  }

  return ret
}

function convertMac(address) {
  let s = String(address.toString(16))
  while (s.length < 12) {
    s = '0' + s
  }
  return chunk(s, 2).join(':')
}

export function f(x) {
  return x.map(v => {
    return {
      ...v,
      longitude: v.longitude * 1e-7,
      latitude: v.latitude * 1e-7,
      mac: convertMac(v.mac)
    }
  })
}
