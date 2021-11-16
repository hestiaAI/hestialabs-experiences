SELECT advertiserName, targetingType, targetingValue, COUNT(*) as count
FROM twitterAds INNER JOIN twitterCriteria
ON twitterAds.id = twitterCriteria.adId
WHERE twitterAds.advertiserName IN (
  SELECT advertiserName
  FROM twitterAds
  GROUP BY advertiserName
  ORDER BY COUNT(*) DESC
  LIMIT 10
)
GROUP BY advertiserName, targetingType, targetingValue
