import { PreprocessorFunction } from '@/types/experience-options'

// skip first 3 rows
export const linkedinConnections: PreprocessorFunction = string =>
  string.split('\n').slice(3).join('\n')
