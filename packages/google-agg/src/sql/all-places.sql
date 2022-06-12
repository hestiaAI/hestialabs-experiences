SELECT DISTINCT latitude, longitude, PlaceVisit.address, PlaceVisit.name, k
FROM PlaceVisit, KAnonymity
WHERE SUBSTR(PlaceVisit.FilePath, 0, INSTR(PlaceVisit.FilePath, '/')) = SUBSTR(KAnonymity.FilePath, 0, INSTR(KAnonymity.FilePath, '/'))