SELECT tweetId, advertiserName AS companyName, engagement, time AS date, targetingType, targetingValue
FROM twitterAds INNER JOIN twitterCriteria
ON twitterAds.id = twitterCriteria.adId
