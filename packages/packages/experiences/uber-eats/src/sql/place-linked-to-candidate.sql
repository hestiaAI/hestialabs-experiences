SELECT
  winnerLatitude,
  winnerLongitude,
  winnerAddress,
  winnerName,
  winnerConfidence,
  winnerSemanticType,
  loserLatitude,
  loserLongitude,
  loserAddress,
  loserName,
  loserConfidence,
  loserSemanticType,
  startTimestamp,
  endTimestamp
FROM
  Winners
  INNER JOIN Losers ON Winners.id = Losers.loserId
WHERE winnerLatitude IS NOT NULL
  AND winnerLongitude IS NOT NULL
  AND loserLatitude IS NOT NULL
  AND loserLongitude IS NOT NULL;
