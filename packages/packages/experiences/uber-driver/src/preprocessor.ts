import type { PipelineOutput } from '@/types/utils'

export async function getMockupData(): Promise<PipelineOutput> {
  return {
    headers: ['begin_ts', 'end_ts', 'status', 'distance', 'price'],
    items: [
      {
        begin_ts: 1629547421,
        end_ts: 1596374556,
        status: 'Waiting (P1)',
        distance: 0,
        price: 0
      },
      {
        begin_ts: 1629024395,
        end_ts: 1600281815,
        status: 'En route (P2)',
        distance: 0,
        price: 0
      },
      {
        begin_ts: 1662998313,
        end_ts: 1606614087,
        status: 'On trip (P3)',
        distance: 16,
        price: 35
      },
      {
        begin_ts: 1640713261,
        end_ts: 1619794292,
        status: 'Waiting (P1)',
        distance: 0,
        price: 0
      },
      {
        begin_ts: 1601996083,
        end_ts: 1612165374,
        status: 'En route (P2)',
        distance: 0,
        price: 0
      },
      {
        begin_ts: 1585698210,
        end_ts: 1610217198,
        status: 'On trip (P3)',
        distance: 5,
        price: 63
      },
      {
        begin_ts: 1649917619,
        end_ts: 1649246833,
        status: 'On trip (P3)',
        distance: 2,
        price: 10
      },
      {
        begin_ts: 1643512076,
        end_ts: 1652488673,
        status: 'En route (P2)',
        distance: 0,
        price: 0
      },
      {
        begin_ts: 1623008976,
        end_ts: 1615138165,
        status: 'Waiting (P1)',
        distance: 0,
        price: 0
      },
      {
        begin_ts: 1665370105,
        end_ts: 1586302383,
        status: 'On trip (P3)',
        distance: 8,
        price: 55
      },
      {
        begin_ts: 1646628808,
        end_ts: 1609063571,
        status: 'On trip (P3)',
        distance: 21,
        price: 65
      },
      {
        begin_ts: 1653211218,
        end_ts: 1654104513,
        status: 'Waiting (P1)',
        distance: 0,
        price: 0
      },
      {
        begin_ts: 1587151072,
        end_ts: 1600767690,
        status: 'En route (P2)',
        distance: 0,
        price: 0
      },
      {
        begin_ts: 1592571052,
        end_ts: 1605338744,
        status: 'Waiting (P1)',
        distance: 0,
        price: 0
      },
      {
        begin_ts: 1585739527,
        end_ts: 1667546138,
        status: 'Waiting (P1)',
        distance: 0,
        price: 0
      },
      {
        begin_ts: 1617400839,
        end_ts: 1640065829,
        status: 'On trip (P3)',
        distance: 29,
        price: 82
      },
      {
        begin_ts: 1604955162,
        end_ts: 1648355498,
        status: 'Waiting (P1)',
        distance: 0,
        price: 0
      },
      {
        begin_ts: 1593771295,
        end_ts: 1599812025,
        status: 'On trip (P3)',
        distance: 19,
        price: 96
      },
      {
        begin_ts: 1611237718,
        end_ts: 1658476452,
        status: 'En route (P2)',
        distance: 0,
        price: 0
      },
      {
        begin_ts: 1633945804,
        end_ts: 1650018918,
        status: 'Waiting (P1)',
        distance: 0,
        price: 0
      },
      {
        begin_ts: 1619513477,
        end_ts: 1613968749,
        status: 'En route (P2)',
        distance: 0,
        price: 0
      },
      {
        begin_ts: 1616315511,
        end_ts: 1577735608,
        status: 'Waiting (P1)',
        distance: 0,
        price: 0
      },
      {
        begin_ts: 1642408868,
        end_ts: 1592398683,
        status: 'En route (P2)',
        distance: 0,
        price: 0
      },
      {
        begin_ts: 1617291382,
        end_ts: 1610817908,
        status: 'En route (P2)',
        distance: 0,
        price: 0
      },
      {
        begin_ts: 1586255101,
        end_ts: 1636509828,
        status: 'Waiting (P1)',
        distance: 0,
        price: 0
      },
      {
        begin_ts: 1596062654,
        end_ts: 1660826462,
        status: 'Waiting (P1)',
        distance: 0,
        price: 0
      },
      {
        begin_ts: 1626051821,
        end_ts: 1586247526,
        status: 'On trip (P3)',
        distance: 6,
        price: 90
      },
      {
        begin_ts: 1669293593,
        end_ts: 1652056010,
        status: 'On trip (P3)',
        distance: 6,
        price: 80
      },
      {
        begin_ts: 1612209935,
        end_ts: 1584840749,
        status: 'Waiting (P1)',
        distance: 0,
        price: 0
      },
      {
        begin_ts: 1658053151,
        end_ts: 1599627502,
        status: 'On trip (P3)',
        distance: 1,
        price: 75
      }
    ]
  }
}
