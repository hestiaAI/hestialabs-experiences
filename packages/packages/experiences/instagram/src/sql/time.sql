SELECT *
FROM (
  SELECT
    accountName,
    datetime AS _date,
    'Post Viewed' AS actionType
  FROM
    InstagramPostViewed
  UNION
  SELECT
    accountName,
    datetime AS _date,
    'Video Watched' AS actionType
  FROM
    InstagramVideoWatched
  UNION
  SELECT
    accountName,
    datetime AS _date,
    'Ad Viewed' AS actionType
  FROM
    InstagramAdViewed
  UNION
  SELECT
    accountName,
    DATETIME(ROUND(timestampMS), 'unixepoch') AS _date,
    'Follow' AS actionType
  FROM
    InstagramFollowing
  UNION
  SELECT
    accountName,
    DATETIME(unixTimestamp, 'unixepoch') AS _date,
    'Comment Liked' AS actionType
  FROM
    InstagramCommentLiked
  UNION
  SELECT
    accountName,
    datetime AS _date,
    'Post Liked' AS actionType
  FROM
    InstagramPostLiked
  UNION
  SELECT
    senderName as accountName,
    DATETIME(ROUND(timestampMS / 1000), 'unixepoch') AS _date,
    'Message Sent' as actionType
  FROM
    InstagramMessage
  WHERE InstagramMessage.senderName IN (SELECT name as username FROM InstagramInfo)
)
ORDER BY _date ASC;
