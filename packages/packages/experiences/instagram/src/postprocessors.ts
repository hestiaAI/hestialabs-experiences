import type { PostprocessorFunction } from '@/types'
import { dateFormatter } from '@/utils'
export const makeSessions: PostprocessorFunction = result => {
  const items = result?.items || []
  if (items.length === 0) {
    return { headers: [], items: [] }
  }

  type Session = {
    start_timestamp: number
    end_timestamp: number
    start_date: string
    end_date: string
    nb_actions: number
    actions: string[]
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const sessions: Session[] = items.reduce((r, o) => {
    const currentDate = new Date(o._date).getTime()
    const lastSession = r.at(-1) || null
    if (
      !lastSession ||
      Math.abs(lastSession.end_timestamp - currentDate) > 120000
    ) {
      const session: Session = {
        start_timestamp: currentDate,
        end_timestamp: currentDate,
        start_date: dateFormatter(new Date(currentDate)),
        end_date: dateFormatter(new Date(currentDate)),
        nb_actions: 1,
        actions: [o.actionType]
      }
      r.push(session)
    } else {
      lastSession.end_timestamp = currentDate
      lastSession.end_date = dateFormatter(new Date(currentDate))
      lastSession.nb_actions += 1
      lastSession.actions.push(o.actionType)
    }
    return r
  }, [] as Session[])
  let max_timestamp = -1
  const results = sessions
    .map(s => {
      if (max_timestamp < s.end_timestamp) {
        max_timestamp = s.end_timestamp
      }
      return {
        ...s,
        duration_m: Math.max(
          (s.end_timestamp - s.start_timestamp) / 1000 / 60,
          1
        )
      }
    })
    .filter(s => s.start_timestamp > max_timestamp - 1000 * 3600 * 24 * 7)

  return {
    headers: ['start_date', 'end_date', 'nb_actions', 'actions', 'duration_m'],
    items: results
  }
}
