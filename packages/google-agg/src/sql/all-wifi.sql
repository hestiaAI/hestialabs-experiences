SELECT mac, AVG(latitude) AS latitude, AVG(longitude) AS longitude, COUNT() AS number_of_participants
FROM Wifi
GROUP BY mac
HAVING COUNT()>1
ORDER BY COUNT() desc