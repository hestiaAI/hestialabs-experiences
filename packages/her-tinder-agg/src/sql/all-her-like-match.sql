SELECT
  SUBSTR(likedAt, 0, INSTR(likedAt, ' ')) AS [date],
  COUNT(HerLikeMatch.matched) AS matches,
  SUBSTR(filePath, 0, INSTR(filePath, '/')) AS userId
FROM
  HerLikeMatch
WHERE
  HerLikeMatch.matched = "true"
GROUP BY
  [date],
  filePath
