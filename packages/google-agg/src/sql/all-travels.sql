SELECT name_of_transport, COUNT() as number_of_participants
FROM (
SELECT DISTINCT SUBSTR(transitPath, 0, INSTR(transitPath, ':')) as name_of_transport, SUBSTR(FilePath, 0, INSTR(FilePath, '/')) as uniqueId
FROM Travels
WHERE transitPath != 'null') a
GROUP BY name_of_transport
ORDER BY COUNT() desc