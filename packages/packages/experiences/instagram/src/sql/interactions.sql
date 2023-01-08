SELECT
  accountName,
  DATETIME(ROUND(timestampMS), 'unixepoch') AS _date,
  'Follow' AS interactionType
FROM
  InstagramFollowing
UNION
SELECT
  accountName,
  DATETIME(unixTimestamp, 'unixepoch') AS _date,
  'Comment Liked' AS interactionType
FROM
  InstagramCommentLiked
UNION
SELECT
  accountName,
  datetime AS _date,
  'Post Liked' AS interactionType
FROM
  InstagramPostLiked
UNION
SELECT
  senderName as accountName,
  DATETIME(ROUND(timestampMS / 1000), 'unixepoch') AS _date,
  'Message Sent' as interactionType
FROM
  InstagramMessage
WHERE InstagramMessage.senderName IN (SELECT name as username FROM InstagramInfo)
UNION
SELECT
  senderName as accountName,
  DATETIME(ROUND(timestampMS / 1000), 'unixepoch') AS _date,
  'Message Received' as interactionType
FROM
  InstagramMessage
WHERE InstagramMessage.senderName NOT IN (SELECT name as username FROM InstagramInfo);
