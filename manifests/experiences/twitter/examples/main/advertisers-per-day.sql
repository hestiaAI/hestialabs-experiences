SELECT advertiserName, date, COUNT(*) AS count
FROM twitterAds
GROUP BY advertiserName, date;
