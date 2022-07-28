SELECT
  dateValue,
  actionType,
  amount
FROM
  TinderUsage
WHERE
  actionType = 'swipes_likes'
  OR actionType = 'swipes_passes'
