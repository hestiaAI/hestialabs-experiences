SELECT  date,
        MAX(CASE WHEN action='swipes_likes'THEN amount ELSE NULL END) likes,
        MAX(CASE WHEN action='swipes_passes'THEN amount ELSE NULL END) pass,
        MAX(CASE WHEN action='app_opens'THEN amount ELSE NULL END) open
FROM TinderUsage
GROUP BY date;
