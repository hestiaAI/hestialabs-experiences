SELECT
  title,
  a.action,
  a.timestamp
FROM
  AdvertiserInteraction a
GROUP BY
  title,
  a.timestamp;
