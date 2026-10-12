import experience from '@hestia.ai/uber-eats'
import FileManager from '~/utils/file-manager'
import NodeFile from '~/utils/node-file'
import { getCustomPipelineFromBlock } from '~/utils/test-utils'

const { preprocessors, files, keepOnlyFiles } = experience.options

const paymentsCsv = [
  'city_name,amount_local,currency_code,classification,category,recognize_timestamp_local',
  // Sunday 4 May (week of 28 April)
  'Lausanne,4.8,CHF,delivery.fare.pickup,driver_payment_fares,2025-05-04 23:59:00',
  'Lausanne,3.2,CHF,delivery.fare.distance,driver_payment_fares,2025-05-04 23:59:00',
  'Lausanne,0.62,CHF,delivery.courier.tax.vat,tax,2025-05-04 23:59:00',
  // Monday 5 May (new week)
  'Lausanne,2.5,CHF,delivery.fare.dropoff,,2025-05-05 00:01:00',
  'Lausanne,-1,CHF,delivery.fare.batch_discount,driver_payment_fares,2025-05-05 12:00:00',
  'Lausanne,3,CHF,transport.misc.tip,tip,2025-05-05 12:00:00',
  'Lausanne,1.57,CHF,eats.mp.charges.location_change_fee,eats_fee,2025-05-05 12:00:00',
  // 30 April, previous month
  'Lausanne,10,CHF,delivery.fare.pickup,driver_payment_fares,2025-04-30 18:00:00',
  // another currency
  'Paris,7,EUR,delivery.fare.pickup,driver_payment_fares,2025-05-06 10:00:00',
  // no date: ignored
  'Lausanne,99,CHF,delivery.fare.pickup,driver_payment_fares,'
].join('\n')

async function run() {
  const fileManager = new FileManager(preprocessors, null, files, keepOnlyFiles)
  await fileManager.init([new NodeFile('export/23a - Driver Payments.csv', paymentsCsv)])
  const pipeline = getCustomPipelineFromBlock(experience, 'service_revenues')
  return pipeline({ fileManager })
}

const row = (items, granularity, period, currency = 'CHF') =>
  items.find(i => i.granularity === granularity && i.period === period && i.currency === currency)

describe('uber-eats – service_revenues', () => {
  test('groups payments into base, tips, VAT and other items by month', async() => {
    const { headers, items } = await run()
    expect(headers).toEqual(['period', 'granularity', 'base', 'tips', 'vat', 'other', 'currency'])
    expect(row(items, 'month', '2025-05')).toEqual({
      period: '2025-05',
      granularity: 'month',
      base: 9.5, // 4.8 + 3.2 + 2.5 - 1
      tips: 3,
      vat: 0.62,
      other: 1.57,
      currency: 'CHF'
    })
    expect(row(items, 'month', '2025-04')).toMatchObject({ base: 10, tips: 0, vat: 0, other: 0 })
  })

  test('splits weeks on Monday', async() => {
    const { items } = await run()
    expect(row(items, 'week', '2025-04-28')).toMatchObject({ base: 18, vat: 0.62 })
    expect(row(items, 'week', '2025-05-05')).toMatchObject({ base: 1.5, tips: 3, other: 1.57 })
  })

  test('keeps currencies apart', async() => {
    const { items } = await run()
    expect(row(items, 'month', '2025-05', 'EUR')).toMatchObject({ base: 7 })
    expect(items.filter(i => i.granularity === 'month').map(i => `${i.period} ${i.currency}`)).toEqual([
      '2025-04 CHF', '2025-05 CHF', '2025-05 EUR'
    ])
  })
})
