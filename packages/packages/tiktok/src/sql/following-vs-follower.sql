SELECT 
  date_,
  actionType,
  COUNT(*) as count_
FROM
  (
  SELECT
    SUBSTR(date, 0, INSTR(date, ' ')) AS date_,
    'Follower' AS actionType
  FROM
    TiktokFollowerList
  UNION 
  SELECT
    SUBSTR(date, 0, INSTR(date, ' ')) AS date_,
    'Following' AS actionType
  FROM
    TiktokFollowingList
  )
GROUP BY date_, actionType;
