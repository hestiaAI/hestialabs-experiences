SELECT advertiserName, targetingType, targetingValue, COUNT(*) AS count
FROM TwitterAd INNER JOIN TwitterCriterion
ON TwitterAd.id = TwitterCriterion.adId
GROUP BY advertiserName, targetingType, targetingValue;
