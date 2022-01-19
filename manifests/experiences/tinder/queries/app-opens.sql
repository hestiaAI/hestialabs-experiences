SELECT  date,
        MAX(CASE WHEN action='app_open'THEN amount ELSE NULL END) open
FROM TinderDB
GROUP BY date;
