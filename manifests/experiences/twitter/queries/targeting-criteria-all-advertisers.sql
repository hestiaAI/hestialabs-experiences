SELECT targetingType, targetingValue, COUNT(*) AS count
FROM TwitterCriterion
GROUP BY targetingType, targetingValue;
