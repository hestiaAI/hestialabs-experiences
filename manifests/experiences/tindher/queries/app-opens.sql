SELECT  date,
        MAX(CASE WHEN action='app_opens'THEN amount ELSE NULL END) open
FROM TinderUsage
GROUP BY date;
