import { PostprocessorFunction } from '@/types'

export const courierTasksPostProcessor: PostprocessorFunction = result => {
  const items = result?.items || []
  const results = items.map(d => {
    return {
      begin_date: d.taskCreationTime
    }
  })
  if (results.length === 0) {
    return { headers: [], items: [] }
  } else {
    return { headers: Object.keys(results[0]), items: results }
  }
}
