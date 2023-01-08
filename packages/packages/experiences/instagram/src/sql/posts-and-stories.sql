SELECT
  title,
  DATETIME(unixTimestamp, 'unixepoch') AS _date,
  latitude,
  longitude,
  'Post' AS actionType
FROM InstagramPost
WHERE latitude IS NOT NULL AND longitude IS NOT NULL
UNION
SELECT
  title,
  DATETIME(unixTimestamp, 'unixepoch') AS _date,
  latitude,
  longitude,
  'Story' AS actionType
FROM InstagramStory
WHERE latitude IS NOT NULL AND longitude IS NOT NULL;
