SELECT
  SUBSTR(likedAt, 0, INSTR(likedAt, ' ')) AS DATE,
  COUNT(HerLikeMatch.matched) AS matches,
  SUBSTR(filePath, 0, INSTR(filePath, '/')) AS userId
FROM
  HerLikeMatch
WHERE
  HerLikeMatch.matched = "true"
GROUP BY
  DATE,
  filePath
