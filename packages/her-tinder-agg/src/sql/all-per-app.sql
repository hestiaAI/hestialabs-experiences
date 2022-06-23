SELECT AVG(likes) as likes,
  AVG(passes) as passes,
  AVG(matches) as matches,
  app
FROM
  (
  SELECT 
    LikesPasses.likes,
    LikesPasses.passes,
    Matches.matches,
    LikesPasses.app
  FROM
    (
      SELECT date,
        SUM(CASE WHEN HerLikeSkip.action = 'Like' THEN HerLikeSkip.count ELSE 0 END) likes,
        SUM(CASE WHEN HerLikeSkip.action = 'Skip' THEN HerLikeSkip.count ELSE 0 END) passes,
        'Her' AS app, 
        'qur' as sexualOrientations,
          SUBSTR(FilePath, 0, INSTR(FilePath, '/')) AS userId
      FROM HerLikeSkip
      GROUP BY date, FilePath
    ) as LikesPasses,
    (
      SELECT SUBSTR(likedAt, 0, INSTR(likedAt, ' ')) AS date, 
        COUNT(HerLikeMatch.matched) as matches,
        SUBSTR(FilePath, 0, INSTR(FilePath, '/')) AS userId
      FROM HerLikeMatch
      WHERE HerLikeMatch.matched = "true"
      GROUP BY date, FilePath
    ) as Matches
  WHERE Matches.date = LikesPasses.date
    AND Matches.userId = LikesPasses.userId

  UNION ALL

  SELECT likes, 
    passes, 
    matches, 
    'Tinder' as app
  FROM TinderUsage, TinderOrientation
  WHERE SUBSTR(TinderUsage.FilePath, 0, INSTR(TinderUsage.FilePath, '/')) = SUBSTR(TinderOrientation.FilePath, 0, INSTR(TinderOrientation.FilePath, '/'))
  )
GROUP BY app
