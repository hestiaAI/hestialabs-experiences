import type { FileManager } from '@/types/utils'

async function csv_babysitter_jobs({ fileManager }: { fileManager: FileManager }) {
  const csv = (await fileManager.getCsvItemsFromId("BabysitterJobs"))[0] ?? {
    headers: [],
    items: [],
  }
  console.log('CSV:', csv);

  const rows = csv.items

  const parseEuropeanDateSafe = (d: string): Date | null => {
    if (!d) return null
    const parts = d.split('.').map(Number)
    if (parts.length !== 3 || parts.some(isNaN)) return null
    return new Date(parts[2], parts[1] - 1, parts[0])
  }

  const hourToTime = (h: number) => {
    const hours = Math.floor(h)
    const minutes = Math.round((h - hours) * 60)
    return { hours, minutes }
  }

  const items = rows
    .map(r => {
      const dateObj = parseEuropeanDateSafe(r.date)
      if (!dateObj) return null

      const startHour = parseFloat(r.startHour)
      const duration = parseFloat(r.nbHours)
      if (isNaN(startHour) || isNaN(duration)) return null

      const start = hourToTime(startHour)
      const begin = new Date(dateObj)
      begin.setHours(start.hours, start.minutes, 0, 0)

      const endTime = hourToTime(startHour + duration)
      const end = new Date(dateObj)
      end.setHours(endTime.hours, endTime.minutes, 0, 0)

      return {
        begin: begin.toISOString(),
        end: end.toISOString(),
        hours: duration
      }
    })
    .filter(Boolean) as { begin: string, end: string, hours: number }[]

  return {
    headers: ["begin", "end", "hours"],
    items
  }
}

const viewerFunctions = {
  postprocessors: {},
  customPipelines: {
    csv_babysitter_jobs
  }
}

export default viewerFunctions
