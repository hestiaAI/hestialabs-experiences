SELECT DISTINCT startLatitude, startLongitude, endLatitude, endLongitude, transitPath, FilePath
FROM Travels
WHERE transitPath != 'null'