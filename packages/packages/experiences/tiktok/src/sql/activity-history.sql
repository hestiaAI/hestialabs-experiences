SELECT
  *
FROM
  (
    SELECT
      DATE AS date_,
      searchterm AS activityValue,
      'Search' AS activityType
    FROM
      SearchHistory
    UNION
    SELECT
      DATE AS date_,
      link AS activityValue,
      'Share' AS activityType
    FROM
      ShareHistory
    UNION
    SELECT
      DATE AS date_,
      videolink AS activityValue,
      'Like' AS activityType
    FROM
      LikeList
    UNION
    SELECT
      DATE AS date_,
      videolink AS activityValue,
      'Watch' AS activityType
    FROM
      VideoBrowsingHistory
    UNION
    SELECT
      DATE AS date_,
      username AS activityValue,
      'Block' AS activityType
    FROM
      BlockList
    UNION
    SELECT
      DATE AS date_,
      comment AS activityValue,
      'Comment' AS activityType
    FROM
      TiktokComment
  )
