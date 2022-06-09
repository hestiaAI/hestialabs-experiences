import type { ViewBlocks } from '@/types'

import sqlAllTinderUser from './sql/all-tinder-user.sql'
import sqlAllTinderUsage from './sql/all-tinder-usage.sql'
import sqlAllHerLikeMatch from './sql/all-her-like-match.sql'
import sqlAllHerLikeSkip from './sql/all-her-like-skip.sql'
import sqlAllHerMessage from './sql/all-her-message.sql'

const blocks: ViewBlocks = [
  {
    id: 'sqlAllTinderUser',
    sql: sqlAllTinderUser,
    showTable: true,
    title: 'sqlAllTinderUser',
    text: 'TBD'
  },
  {
    id: 'sqlAllTinderUsage',
    sql: sqlAllTinderUsage,
    showTable: true,
    title: 'sqlAllTinderUsage',
    text: 'TBD'
  },
  {
    id: 'sqlAllHerLikeMatch',
    sql: sqlAllHerLikeMatch,
    showTable: true,
    title: 'sqlAllHerLikeMatch',
    text: 'TBD'
  },
  {
    id: 'sqlAllHerLikeSkip',
    sql: sqlAllHerLikeSkip,
    showTable: true,
    title: 'sqlAllHerLikeSkip',
    text: 'TBD'
  },
  {
    id: 'sqlAllHerMessage',
    sql: sqlAllHerMessage,
    showTable: true,
    title: 'sqlAllHerMessage',
    text: 'TBD'
  }
]

export default blocks
