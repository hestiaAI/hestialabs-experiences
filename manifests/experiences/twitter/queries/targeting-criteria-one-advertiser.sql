SELECT targetingType, targetingValue, COUNT(*) AS count
FROM twitterAds INNER JOIN twitterCriteria
ON twitterAds.id = twitterCriteria.adId
WHERE advertiserName = :advertiser
GROUP BY targetingType, targetingValue;
