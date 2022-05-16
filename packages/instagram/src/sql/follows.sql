SELECT accountName, accountURL, DATETIME(ROUND(timestampMS), 'unixepoch') AS followDate, 'Follower' AS followType
FROM InstagramFollower

UNION

SELECT accountName, accountURL, DATETIME(ROUND(timestampMS), 'unixepoch') AS followDate, 'Following' AS followType
FROM InstagramFollowing;
