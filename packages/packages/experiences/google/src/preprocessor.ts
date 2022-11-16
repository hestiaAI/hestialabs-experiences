import { PreprocessorFunction } from '@/types/experience-options'

const takeout: PreprocessorFunction = string => {
  const regexp =
    /data-english-name="([a-zA-ZÀ-ÿ-._]+)" data-folder-name="([a-zA-ZÀ-ÿ-._ ]+)/g
  const matches = string.matchAll(regexp)
  const idToGlob: { [key: string]: string } = {}
  for (const match of matches) {
    idToGlob[match[1]] = `**/${match[2]}/**/*.json`
  }
  return JSON.stringify(idToGlob)
}
export default takeout
