SELECT
  name AS targetingType,
  type AS targetingValue,
  COUNT(*) AS count_
FROM
  OffFacebookActivityEvent
WHERE
  targetingType IN (
    SELECT
      name
    FROM
      OffFacebookActivityEvent
    GROUP BY
      name
    ORDER BY
      COUNT(*) DESC
    LIMIT
      10
  )
GROUP BY
  targetingType,
  targetingValue
