import { PreprocessorFunction } from '@/types/experience-options'

const twitter: PreprocessorFunction = string => {
  try {
    // replace variable assignment in JS file from Twitter + pretty json string
    const jsonStr = JSON.stringify(
      JSON.parse(string.replace(/^[0-9a-zA-Z_.]+\s+=/, '')),
      null,
      2
    )
    return jsonStr
  } catch (e) {
    console.error(e)
    return ''
  }
}

export default twitter
