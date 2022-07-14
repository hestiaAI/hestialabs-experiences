import type { PostprocessorFunction } from '@/types'
import { PipelineOutputItems } from '@/types/utils'

function convert_mac(address: number) {
  let s = String(address.toString(16))
  while (s.length < 12) {
    s = '0' + s
  }
  return chunk(s, 2).join(':')
}
function chunk(str: string, n: number) {
  const ret = []
  let i
  let len

  for (i = 0, len = str.length; i < len; i += n) {
    ret.push(str.substr(i, n))
  }

  return ret
}

function compute_duration(d1: string, d2: string) {
  const date1 = new Date(d1).getTime()
  const date2 = new Date(d2).getTime()
  const res = Math.floor(Math.abs(date1 - date2) / 1000)
  return res
}

function parseTransitPath(transitPath: string) {
  if (transitPath !== 'undefined' && transitPath !== null) {
    const dico = JSON.parse(transitPath)
    const name = dico.name
    return (
      name +
      ': ' +
      dico.transitStops[0].name +
      ' -> ' +
      dico.transitStops[dico.transitStops.length - 1].name
    )
  } else {
    return null
  }
}

export const wifiPostProcessor: PostprocessorFunction = result => {
  const items = result?.items || []
  const results = items.map(v => {
    return {
      ...v,
      longitude: v.longitude * 1e-7,
      latitude: v.latitude * 1e-7,
      mac: convert_mac(v.mac)
    }
  })
  return { headers: Object.keys(results[0]), items: results }
}

export const otherCandidatesPostProcessor: PostprocessorFunction = result => {
  const items = result?.items || []
  //const entropies = computeEntropy(items)
  const results = items.map(v => {
    return {
      ...v,
      winnerLatitude: v.winnerLatitude * 1e-7,
      winnerLongitude: v.winnerLongitude * 1e-7,
      winnerSemanticType:
        v.winnerSemanticType === 'undefined' ? null : v.winnerSemanticType,
      loserLatitude: v.loserLatitude * 1e-7,
      loserLongitude: v.loserLongitude * 1e-7,
      loserSemanticType:
        v.loserSemanticType === 'undefined' ? null : v.loserSemanticType,
      loserAddress: v.loserAddress === 'undefined' ? null : v.loserAddress,
      winnerName: v.winnerName === 'undefined' ? null : v.winnerName,
      loserName: v.loserName === 'undefined' ? null : v.loserName
      //entropy: entropies[v.winnerName]
    }
  })
  return { headers: Object.keys(results[0]), items: results }
}

export const tripsPostProcessor: PostprocessorFunction = result => {
  const items = result?.items || []
  const results = items.map(v => {
    return {
      ...v,
      startLongitude: v.startLongitude * 1e-7,
      startLatitude: v.startLatitude * 1e-7,
      endLongitude: v.endLongitude * 1e-7,
      endLatitude: v.endLatitude * 1e-7,
      startAddress: v.startAddress === 'undefined' ? null : v.startAddress,
      endAddress: v.endAddress === 'undefined' ? null : v.endAddress,
      startName: v.startName === 'undefined' ? null : v.startName,
      endName: v.endName === 'undefined' ? null : v.endName,
      transitPath: parseTransitPath(v.transitPath)
    }
  })
  return { headers: Object.keys(results[0]), items: results }
}

export const placesPostProcessor: PostprocessorFunction = result => {
  const items = result?.items || []
  const results = items.map(v => {
    return {
      ...v,
      longitude: v.longitude * 1e-7,
      latitude: v.latitude * 1e-7,
      semanticType: v.semanticType === 'undefined' ? null : v.semanticType,
      duration: compute_duration(v.startTimestamp, v.endTimestamp)
    }
  })
  return { headers: Object.keys(results[0]), items: results }
}

export const recordsPostProcessor: PostprocessorFunction = result => {
  const items = result?.items || []
  const results = items.map(v => {
    return {
      ...v,
      longitude: v.longitude * 1e-7,
      latitude: v.latitude * 1e-7
    }
  })
  return { headers: Object.keys(results[0]), items: results }
}

function avg(arr: number[]) {
  const sum = arr.reduce((a: number, b: number) => a + b, 0)
  return sum / arr.length || 0
}

/**
function computeEntropy(list: PipelineOutputItems) {
  const grouped = groupBy(list, x => x.startTimestamp)
  const keys = Object.keys(grouped)
  const entropies = []
  for (let i = 0; i < keys.length; i++) {
    const elem = grouped[keys[i]]
    let val = elem[0].winnerConfidence / 100
    let sum = val * Math.log2(val)
    for (let j = 0; j < elem.length; j++) {
      val = elem[j].loserConfidence / 100
      sum += val * Math.log2(val)
    }
    entropies.push({ winnerName: elem[0].winnerName, entropy: sum })
  }
  const grouped_entropies = groupBy(entropies, x => x.winnerName)
  const name_to_entropy = Object.keys(grouped_entropies).map(x => {
    return {
      winnerName: x,
      entropy: avg(grouped_entropies[x].map(v => v.entropy))
    }
  })
  const res = Object.assign(
    {},
    ...name_to_entropy.map(x => ({ [x.winnerName]: x.entropy }))
  )
  return res
}
*/
