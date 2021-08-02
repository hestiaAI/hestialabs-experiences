export const state = () => ({
  experiences: [
    {
      title: 'TrackerControl',
      subtitle: 'Tracking data',
      key: 'tracker-control',
      imgsrc: 'https://trackercontrol.org/images/logo.png'
    },
    {
      title: 'Twitter',
      subtitle: 'Targeting Information',
      key: 'twitter-targeting-information',
      imgsrc:
        'https://www.iconpacks.net/icons/2/free-twitter-logo-icon-2429-thumb.png'
    },
    {
      title: 'Generic JSON',
      subtitle: 'help for experimentation',
      key: 'generic-json',
      imgsrc: 'https://image.flaticon.com/icons/png/512/136/136443.png'
    }
  ]
})

export const getters = {
  getExperienceByKey: state => key => {
    return state.experiences.find(exp => exp.key === key)
  }
}
