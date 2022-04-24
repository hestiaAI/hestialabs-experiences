SELECT name AS advertiserName, timestamp AS date, COUNT(*) as count
FROM OffFacebookActivityEvent
GROUP BY name, timestamp;
