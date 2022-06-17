SELECT SUBSTR(likedAt, 0, INSTR(likedAt, ' ')) AS date, 
  COUNT(HerLikeMatch.matched) as matches,
  SUBSTR(FilePath, 0, INSTR(FilePath, '/')) AS userId
FROM HerLikeMatch
WHERE HerLikeMatch.matched = "true"
GROUP BY date, FilePath
