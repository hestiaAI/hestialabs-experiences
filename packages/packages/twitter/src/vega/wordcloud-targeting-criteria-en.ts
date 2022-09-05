import vegaWordcloudTargetingCriteria from './wordcloud-targeting-criteria'

const descriptions = [
  'Twitter determine users similar to those who follow accounts based on a variety of signals, including what they Retweet, click on, Tweet, and more.',
  'Twitter determine interests based on a variety of signals, including who they follow, what they Retweet, click on, Tweet, and more.',
  'Reach groups of people who have taken a specific action in your app, such as installs or sign-ups.',
  "It is possible to collect this data using Twitter's website tag available through Twitter Ads.",
  'Lists are created by uploading a file containing your email address, mobile advertising ID or Twitter username.',
  "People may be considered part of a conversation audience if they've Tweeted or engaged with a Tweet mentioning the topic.",
  'Keyword targeting allows advertisers to reach people on Twitter based on keywords in their search queries, recent Tweets, and Tweets they recently engaged with.',
  "Twitter’s geo targeting is based on someone's recent location. This is a combination of current location and recent location history. Twitter uses several signals for determining whether someone is presently in a particular geographic location, such as web IP address, mobile GPS signal, mobile WiFi signal, and real-time signals, such as when someone includes their location in a Tweet.",
  'If not specified in your Twitter profile, Twitter deduct it from users who did it, based on a number of attributes such as the accounts they follows and their interests.',
  'Twitter derive a person’s language from the language selected in their profile settings, the languages that correspond to their activity on Twitter and more.',
  "Twitter use the gender provided by people in their profiles, and extend that data to other people based on factors of account likeness to determine the gender of people haven't manually entered their preferred gender.",
  'Advertisers can target by Operating System (e.g IOS vs Android)',
  'Advertisers can target by platform used by the client (e.g Iphone 7 vs Iphone 8)',
  "With event targeting, Twitter can discover and target the events that best fit the advertisers' audience — then create a campaign that delivers their ads at just the right time to just the right audience as the event unfolds."
]

const dictionary = {
  filterSignalName: 'Criteria',
  'was used by': 'was used by',
  'advertiser(s)': 'advertiser(s)'
}
export default vegaWordcloudTargetingCriteria(descriptions, dictionary)
