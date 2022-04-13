WITH Temp AS (
  SELECT substr(likedAt, 7, 4) || "-" || substr(likedAt, 4, 2) || "-" || substr(likedAt, 1, 2) AS likedAtDate
  FROM HerLike
)
SELECT likedAtDate, "Likes" AS actionValue, COUNT(*) AS likesCount
FROM Temp
GROUP BY likedAtDate;
