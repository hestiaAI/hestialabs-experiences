SELECT advertiserName, COUNT(*) AS count
FROM twitterAds
GROUP BY advertiserName;
