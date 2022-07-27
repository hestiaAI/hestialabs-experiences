SELECT
  latitude,
  longitude,
  r.timestamp,
  accuracy,
  source,
  activityType
FROM
  Records r;
