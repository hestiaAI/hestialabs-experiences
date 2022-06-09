SELECT DISTINCT loserName, startTimestamp, endTimestamp, loserLatitude, loserLongitude
FROM PlaceVisit, OtherCandidate
WHERE name = 'Powerhouse' AND winnerName = 'Powerhouse'
--tl - Transports publics de la région lausannoise