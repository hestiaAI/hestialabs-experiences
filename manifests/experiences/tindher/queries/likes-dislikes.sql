SELECT  date,
        MAX(CASE WHEN action='swipe_like'THEN amount ELSE NULL END) likes,
        MAX(CASE WHEN action='swipe_pass'THEN amount ELSE NULL END) pass
FROM TinderDB
GROUP BY date;
