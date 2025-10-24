SELECT
  *
FROM
  ActivitySegment
WHERE
  startLatitude IS NOT NULL
  AND startLongitude IS NOT NULL
  AND endLatitude IS NOT NULL
  AND endLongitude IS NOT NULL;
