SELECT latitude, longitude, b.address, b.name, COUNT() AS number_of_participants
FROM (SELECT AVG(latitude) as latitude, AVG(longitude) as longitude, a.address, a.name, uniqueId
FROM (SELECT DISTINCT latitude, longitude, PlaceVisit.address, PlaceVisit.name, SUBSTR(FilePath, 0, INSTR(FilePath, '/')) as uniqueId FROM PlaceVisit) a
GROUP BY a.address, a.name, uniqueId) b
GROUP BY b.name, b.address
HAVING COUNT(uniqueId)>0
ORDER BY COUNT(uniqueId) desc
