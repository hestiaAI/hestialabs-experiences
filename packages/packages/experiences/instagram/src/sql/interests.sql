SELECT title, 'Ad Interest' as _type FROM InstagramAdInterest
UNION
SELECT title, 'Topic' as _type FROM InstagramYourTopic
UNION
SELECT title, 'Reel Topic' as _type FROM InstagramReelTopic
UNION
SELECT title, 'Reel Sentiment' as _type FROM InstagramReelSentiment;
