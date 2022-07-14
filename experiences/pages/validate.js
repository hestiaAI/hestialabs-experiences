// Validate `bubble` parameter
export const validateBubble = ({ store, params }) =>
  store.state.config.bubbles.includes(params.bubble)

// Validate `experience` parameter
// 1. /experience/:experience
// 2. /bubble/:bubble/experience/:experience
export const validateExperience = ({ store, params: { experience, bubble } }) =>
  store.getters.enabledExperiences.find(x => x.slug === experience) &&
  (!bubble ||
    store.state.config.bubbleConfig[bubble].experiences.includes(experience))

export default {
  bubble: validateBubble,
  experience: validateExperience
}
