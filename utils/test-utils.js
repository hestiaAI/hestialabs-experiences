export function arrayEqualNoOrder(array1, array2) {
  array2.forEach(x => expect(array1).toContainEqual(x))
  array1.forEach(x => expect(array2).toContainEqual(x))
  expect(array1.length).toBe(array2.length)
}
