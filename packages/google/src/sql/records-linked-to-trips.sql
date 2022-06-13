WITH a AS (
  SELECT *
  FROM Records
  ORDER BY Records.timestamp DESC
  LIMIT 100000)

SELECT a.latitude, a.longitude, a.timestamp, a.accuracy, a.source, ActivitySegment.activityType
FROM a, ActivitySegment
WHERE a.timestamp >= startTimestamp AND a.timestamp <= endTimestamp