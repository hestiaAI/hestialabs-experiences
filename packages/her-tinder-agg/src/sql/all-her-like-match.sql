SELECT SUBSTR(likedAt, 0, INSTR(likedAt, 'T')) AS date, COUNT(HerLikeMatch.matched) as matches, FilePath
FROM HerLikeMatch
WHERE HerLikeMatch.matched = "true"
GROUP BY date, FilePath;
