SELECT
  name AS targetingType,
  type AS targetingValue,
  COUNT(*) as count
FROM
  OffFacebookActivityEvent
WHERE
  targetingType in (
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
