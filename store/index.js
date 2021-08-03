export const state = () => ({
  experiences: [
    {
      title: 'Playground',
      subtitle: 'Help for experimentation',
      key: 'playground',
      imgsrc:
        'https://dinacon.ch/wp-content/uploads/sites/4/2018/05/rdf-icon-with-shadow-300x300.png'
    },
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
      title: 'Twitter',
      subtitle: 'Advertisers',
      key: 'twitter-advertisers',
      imgsrc:
        'https://www.iconpacks.net/icons/2/free-twitter-logo-icon-2429-thumb.png'
    },
    {
      title: 'Twitter',
      subtitle: 'SHA’d Advertisers',
      key: 'twitter-advertisers-sha',
      imgsrc:
        'https://www.iconpacks.net/icons/2/free-twitter-logo-icon-2429-thumb.png'
    }
  ]
})

export const getters = {
  getExperienceByKey: state => key => {
    return state.experiences.find(exp => exp.key === key)
  }
}
