SELECT targetingType, targetingValue, COUNT(*) AS count
FROM TwitterAd INNER JOIN TwitterCriterion
ON TwitterAd.id = TwitterCriterion.adId
WHERE advertiserName LIKE :advertiser
GROUP BY targetingType, targetingValue;
