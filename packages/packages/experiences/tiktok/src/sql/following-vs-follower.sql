SELECT
  date_,
  actionType,
  COUNT(*) AS count_
FROM
  (
    SELECT
      SUBSTR(DATE, 0, INSTR(DATE, ' ')) AS date_,
      'Follower' AS actionType
    FROM
      TiktokFollowerList
    UNION
    SELECT
      SUBSTR(DATE, 0, INSTR(DATE, ' ')) AS date_,
      'Following' AS actionType
    FROM
      TiktokFollowingList
  )
GROUP BY
  date_,
  actionType;
