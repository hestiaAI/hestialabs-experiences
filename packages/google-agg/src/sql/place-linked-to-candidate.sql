SELECT winnerLatitude, winnerLongitude, winnerAddress, winnerName, winnerConfidence, winnerSemanticType, loserLatitude, loserLongitude, loserAddress, loserName, loserConfidence, loserSemanticType, timestamp
FROM Winners INNER JOIN Losers
  ON Winners.id = Losers.loserId