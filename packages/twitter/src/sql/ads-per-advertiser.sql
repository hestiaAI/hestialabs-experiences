SELECT advertiserName, DATE(time) AS date, COUNT(*) AS count
FROM TwitterAd
GROUP BY advertiserName;
