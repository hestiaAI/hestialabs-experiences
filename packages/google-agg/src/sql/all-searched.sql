WITH Losers AS(
  SELECT DISTINCT loserLatitude AS latitude, loserLongitude AS longitude, loserName AS name, SUBSTR(FilePath, 0, INSTR(FilePath, '/')) as uniqueId
  FROM OtherCandidate
  WHERE loserSemanticType = "TYPE_SEARCHED_ADDRESS"
),
Winners AS(
  SELECT DISTINCT winnerLatitude AS latitude, winnerLongitude AS longitude, winnerName AS name, SUBSTR(FilePath, 0, INSTR(FilePath, '/')) as uniqueId
  FROM OtherCandidate
  WHERE winnerSemanticType = "TYPE_SEARCHED_ADDRESS"
)
SELECT latitude, longitude, a.name, COUNT() AS number_of_participants
FROM (SELECT * FROM Losers UNION SELECT * FROM Winners) a
GROUP BY latitude, longitude, a.name
HAVING COUNT(uniqueId)>0
ORDER BY COUNT(uniqueId) desc