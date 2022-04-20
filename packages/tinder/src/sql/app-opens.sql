SELECT  date,
        MAX(CASE WHEN action='app_opens'THEN amount ELSE NULL END) open
FROM Tinder
GROUP BY date;
