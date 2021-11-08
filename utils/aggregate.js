// https://stackoverflow.com/a/62393557
export function aggregate(data, indices, reducer) {
  // helper to create unique index as an array
  function getUniqueIndexHash(row, indices) {
    return indices.reduce((acc, curr) => acc + row[curr], '')
  }

  // reduce data to single object, whose values will be each of the new rows
  // structure is an object whose values are arrays
  // [{}] -> {{}}
  // no operation performed, simply grouping
  const groupedObj = data.reduce((acc, curr) => {
    const currIndex = getUniqueIndexHash(curr, indices)

    if (!Object.keys(acc).includes(currIndex)) {
      // if key does not exist, create array with current row
      acc = { ...acc, [currIndex]: [curr] }
    } else {
      // otherwise, extend the array at currIndex
      acc = { ...acc, [currIndex]: acc[currIndex].concat(curr) }
    }

    return acc
  }, {})

  // reduce the array into a single object by applying the reducer
  const reduced = Object.values(groupedObj).map(arr => {
    // for each sub-array, reduce into single object using the reducer function
    let reduceValues = arr.reduce(reducer, {})

    // reducer returns simply the aggregates - add in the indices here
    // each of the objects in "arr" has the same indices, so we take the first
    const indexObj = indices.reduce((acc, curr) => {
      acc = { ...acc, [curr]: arr[0][curr] }
      return acc
    }, {})

    reduceValues = { ...indexObj, ...reduceValues }

    return reduceValues
  })

  return reduced
}

export function countReducer(name) {
  return (acc, curr) => {
    acc[name] = 1 + (acc[name] || 0)
    return acc
  }
}
