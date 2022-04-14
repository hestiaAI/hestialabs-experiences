SELECT
  dateValue,
  amount,
  CASE actionType
    WHEN 'swipes_passes' THEN 'Passes'
    WHEN 'swipes_likes' THEN 'Likes'
    ELSE NULL
  END AS actionType
FROM TinderUsage
WHERE actionType IN ('swipes_passes', 'swipes_likes')
ORDER BY actionType DESC;
