SELECT startLatitude, startLongitude, endLatitude, endLongitude, transitPath, k
FROM Travels, KAnonymity
WHERE transitPath != 'null' AND SUBSTR(Travels.FilePath, 0, INSTR(Travels.FilePath, '/')) = SUBSTR(KAnonymity.FilePath, 0, INSTR(KAnonymity.FilePath, '/'))