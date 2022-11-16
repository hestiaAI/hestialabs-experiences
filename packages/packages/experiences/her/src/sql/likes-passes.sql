WITH
  TempLike AS (
    SELECT
      SUBSTR(likedAt, 1, 10) AS likedAt
    FROM
      HerLike
  ),
  TempSkip AS (
    SELECT
      SUBSTR(skippedAt, 1, 10) AS skippedAt
    FROM
      HerSkip
  )
SELECT
  likedAt AS date_,
  "Like" AS actionValue,
  COUNT(*) AS actionCount
FROM
  TempLike
GROUP BY
  likedAt
UNION
SELECT
  skippedAt AS date_,
  "Skip" AS actionValue,
  COUNT(*) AS actionCount
FROM
  TempSkip
GROUP BY
  skippedAt;
