SELECT name AS advertiserName, timestamp AS date, COUNT(*) as count
FROM offFacebookActivityDatabase
GROUP BY name, timestamp;
