// Uber's "*_local" timestamps are local wall-clock times, sometimes written
// with a misleading "Z" (e.g. 2023-11-09T13:26:19.000Z) and sometimes as
// "2023-11-10 11:36:36". Read the written fields directly so the results
// never depend on the visitor's timezone.

export interface LocalTime {
  date: string // YYYY-MM-DD
  year: number
  month: number // 1-12
  day: number
  hour: number // 0-23
  minute: number
  second: number
}

const LOCAL_TIME = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?/

export function parseLocalTime(value: unknown): LocalTime | undefined {
  const match = LOCAL_TIME.exec(String(value ?? '').trim())
  if (!match) {
    return undefined
  }
  const [, y, m, d, hh, mm, ss] = match
  return {
    date: `${y}-${m}-${d}`,
    year: Number(y),
    month: Number(m),
    day: Number(d),
    hour: Number(hh),
    minute: Number(mm),
    second: Number(ss ?? 0)
  }
}

// ISO weekday: 1 = Monday ... 7 = Sunday
export function isoWeekday({ year, month, day }: LocalTime): number {
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay()
  return weekday === 0 ? 7 : weekday
}

// The Monday (YYYY-MM-DD) of the week containing this date
export function weekStart(time: LocalTime): string {
  const monday = new Date(Date.UTC(time.year, time.month - 1, time.day))
  monday.setUTCDate(monday.getUTCDate() - (isoWeekday(time) - 1))
  return monday.toISOString().slice(0, 10)
}

// Milliseconds since the epoch, treating the local time as if it were UTC.
// Only meaningful for differences and boundaries between local times.
export function localMillis(time: LocalTime): number {
  return Date.UTC(
    time.year,
    time.month - 1,
    time.day,
    time.hour,
    time.minute,
    time.second
  )
}
