SELECT advertiserName, targetingType, targetingValue, COUNT(*) as count
FROM TwitterAd INNER JOIN TwitterCriterion
ON TwitterAd.id = TwitterCriterion.adId
WHERE TwitterAd.advertiserName IN (
  SELECT advertiserName
  FROM TwitterAd
  GROUP BY advertiserName
  ORDER BY COUNT(*) DESC
  LIMIT 10
)
GROUP BY advertiserName, targetingType, targetingValue
