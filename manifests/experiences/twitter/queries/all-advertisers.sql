SELECT advertiserName, COUNT(*) AS count
FROM TwitterAd
GROUP BY advertiserName;
