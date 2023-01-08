SELECT
  accountName,
  datetime AS actionDate,
  'Post Viewed' AS actionType
FROM
  InstagramPostViewed
UNION
SELECT
  accountName,
  datetime AS actionDate,
  'Video Watched' AS actionType
FROM
  InstagramVideoWatched
UNION
SELECT
  accountName,
  datetime AS actionDate,
  'Ad Viewed' AS actionType
FROM
  InstagramAdViewed;
