WITH TempLike AS (
  SELECT substr(likedAt, 7, 4) || "-" || substr(likedAt, 4, 2) || "-" || substr(likedAt, 1, 2) AS likedAt
  FROM HerLike
), TempSkip AS (
  SELECT substr(skippedAt, 7, 4) || "-" || substr(skippedAt, 4, 2) || "-" || substr(skippedAt, 1, 2) AS skippedAt
  FROM HerSkip
)
SELECT likedAt as date, "Like" AS actionValue, COUNT(*) AS actionCount
FROM TempLike
GROUP BY likedAt
UNION
SELECT skippedAt as date, "Skip" AS actionValue, COUNT(*) AS actionCount
FROM TempSkip
GROUP BY skippedAt;
