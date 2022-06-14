SELECT
  targetingType,
  targetingValue,
  COUNT(*) AS count_
FROM
  TwitterCriterion
GROUP BY
  targetingType,
  targetingValue;
