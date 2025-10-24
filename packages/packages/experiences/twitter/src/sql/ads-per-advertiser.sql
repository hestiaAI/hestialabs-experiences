SELECT
  advertiserName,
  DATE(t.time) AS date_,
  COUNT(*) AS count_
FROM
  TwitterAd t
GROUP BY
  advertiserName;
