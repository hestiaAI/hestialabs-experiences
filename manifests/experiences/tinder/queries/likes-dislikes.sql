SELECT  date,
        MAX(CASE WHEN action='swipes_likes'THEN amount ELSE NULL END) likes,
        MAX(CASE WHEN action='swipes_passes'THEN amount ELSE NULL END) pass
FROM Tinder
GROUP BY date;
