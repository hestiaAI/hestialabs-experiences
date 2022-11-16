SELECT
  advertiserName,
  targetingType,
  targetingValue,
  COUNT(*) AS count_
FROM
  TwitterAd
  INNER JOIN TwitterCriterion ON TwitterAd.id = TwitterCriterion.adId
GROUP BY
  advertiserName,
  targetingType,
  targetingValue;
