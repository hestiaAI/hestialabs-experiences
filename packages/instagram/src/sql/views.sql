SELECT
  accountName,
  DATETIME(unixTimestamp, 'unixepoch') AS actionDate,
  'Post Viewed' AS actionType
FROM
  InstagramPostViewed
UNION
SELECT
  accountName,
  DATETIME(unixTimestamp, 'unixepoch') AS actionDate,
  'Video Watched' AS actionType
FROM
  InstagramVideoWatched
UNION
SELECT
  accountName,
  DATETIME(unixTimestamp, 'unixepoch') AS actionDate,
  'Ad Viewed' AS actionType
FROM
  InstagramAdViewed;
