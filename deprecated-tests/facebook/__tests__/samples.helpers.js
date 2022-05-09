export const advertisersUsingYourActivity = {
  custom_audiences_all_types_v2: [
    {
      advertiser_name: 'foo',
      has_data_file_custom_audience: true,
      has_remarketing_custom_audience: true,
      has_in_person_store_visit: true
    },
    {
      advertiser_name: 'bar',
      has_data_file_custom_audience: true,
      has_remarketing_custom_audience: false,
      has_in_person_store_visit: false
    }
  ]
}

export const advertisersWhoUploadedAContactList = {
  custom_audiences_v2: ['Apple', 'Google', 'Microsoft']
}

export const advertisersInteractedWith = {
  history_v2: [
    {
      title: 'SALE',
      action: 'Closed ad',
      timestamp: 1629695476
    },
    {
      title: 'How to get 10000$ with this one simple trick',
      action: 'Clicked ad',
      timestamp: 1629440065
    }
  ]
}

export const yourOffFacebookActivity = {
  off_facebook_activity_v2: [
    {
      name: 'App01',
      events: [
        {
          id: 853766335050306,
          type: 'CUSTOM',
          timestamp: 1615460377
        }
      ]
    },
    {
      name: 'App02',
      events: [
        {
          id: 848885878139747,
          type: 'CUSTOM',
          timestamp: 1600622182
        }
      ]
    }
  ]
}

export const adsInterests = {
  topics_v2: ['Computer Science', 'Space']
}
