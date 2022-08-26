SELECT
  *
FROM
(
  SELECT
    date AS date_,
    searchterm AS activityValue,
    'Search' AS activityType
  FROM SearchHistory
  UNION 
  SELECT
    date AS date_,
    link AS activityValue,
    'Share' AS activityType
  FROM ShareHistory
  UNION
  SELECT
    date AS date_,
    videolink AS activityValue,
    'Like' AS activityType
  FROM LikeList
  UNION
  SELECT
    date AS date_,
    videolink AS activityValue,
    'Watch' AS activityType
  FROM VideoBrowsingHistory
  UNION
  SELECT
    date AS date_,
    username AS activityValue,
    'Block' AS activityType
  FROM BlockList
  UNION
  SELECT
    date AS date_,
    comment AS activityValue,
    'Comment' AS activityType
  FROM TiktokComment
)
