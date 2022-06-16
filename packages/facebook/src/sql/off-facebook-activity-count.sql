SELECT
  name AS advertiserName,
  o.timestamp AS date_,
  COUNT(*) AS count_
FROM
  OffFacebookActivityEvent o
GROUP BY
  name,
  o.timestamp;
