// Validate `bubble` parameter
export const validateBubble = ({ store, params }) =>
  store.state.config.bubbles.includes(params.bubble)

// Validate `experience` parameter
// 1. /experience/:experience
// 2. /bubble/:bubble/experience/:experience
export const validateExperience = ({ store, route }) => {
  const experience = store.getters.experience(route)
  return typeof experience === 'object' && !experience.disabled
}

export default {
  bubble: validateBubble,
  experience: validateExperience
}
