import getCsvHeadersAndItems from './csv'

const csvTestString = 'x,y,z\n1,2,3\n4,5,6'

test('simple CSV parsing', () => {
  return getCsvHeadersAndItems(csvTestString).then(result => {
    expect(result.headers).toStrictEqual(['x', 'y', 'z'])
    expect(result.items).toStrictEqual([
      { x: '1', y: '2', z: '3' },
      { x: '4', y: '5', z: '6' }
    ])
  })
})
