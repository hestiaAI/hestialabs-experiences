SELECT advertiserName, targetingType, targetingValue, COUNT(*) AS count
FROM twitterAds INNER JOIN twitterCriteria
ON twitterAds.id = twitterCriteria.adId
GROUP BY advertiserName, targetingType, targetingValue;
