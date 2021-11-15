SELECT advertiserName, DATE(time) AS date, COUNT(*) AS count
FROM twitterAds
GROUP BY advertiserName, DATE(time);
