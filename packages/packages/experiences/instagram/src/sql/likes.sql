SELECT
  accountName,
  DATETIME(unixTimestamp, 'unixepoch') AS actionDate,
  'Comment Liked' AS actionType
FROM
  InstagramCommentLiked
UNION
SELECT
  accountName,
  DATETIME(unixTimestamp, 'unixepoch') AS actionDate,
  'Post Liked' AS actionType
FROM
  InstagramPostLiked;
