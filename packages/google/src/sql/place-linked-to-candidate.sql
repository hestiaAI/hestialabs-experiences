SELECT winnerLatitude, winnerLongitude, winnerAddress, winnerName, winnerConfidence, winnerSemanticType, loserLatitude, loserLongitude, loserAddress, loserName, loserConfidence, loserSemanticType, startTimestamp, endTimestamp
FROM Winners INNER JOIN Losers
  ON Winners.id = Losers.loserId