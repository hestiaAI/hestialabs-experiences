SELECT targetingType, targetingValue, COUNT(*) AS count
FROM twitterCriteria
GROUP BY targetingType, targetingValue;
