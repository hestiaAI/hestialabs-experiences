SELECT
  AVG(likes) AS likes,
  AVG(passes) AS passes,
  AVG(matches) AS matches,
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
        SELECT
          DATE,
          SUM(
            CASE
              WHEN HerLikeSkip.action = 'Like' THEN HerLikeSkip.count
              ELSE 0
            END
          ) likes,
          SUM(
            CASE
              WHEN HerLikeSkip.action = 'Skip' THEN HerLikeSkip.count
              ELSE 0
            END
          ) passes,
          'Her' AS app,
          'qur' AS sexualOrientations,
          SUBSTR(FilePath, 0, INSTR(FilePath, '/')) AS userId
        FROM
          HerLikeSkip
        GROUP BY
          DATE,
          FilePath
      ) LikesPasses,
      (
        SELECT
          SUBSTR(likedAt, 0, INSTR(likedAt, ' ')) AS DATE,
          COUNT(HerLikeMatch.matched) AS matches,
          SUBSTR(FilePath, 0, INSTR(FilePath, '/')) AS userId
        FROM
          HerLikeMatch
        WHERE
          HerLikeMatch.matched = "true"
        GROUP BY
          DATE,
          FilePath
      ) Matches
    WHERE
      Matches.date = LikesPasses.date
      AND Matches.userId = LikesPasses.userId
    UNION ALL
    SELECT
      likes,
      passes,
      matches,
      'Tinder' AS app
    FROM
      TinderUsage,
      TinderOrientation
    WHERE
      SUBSTR(
        TinderUsage.FilePath,
        0,
        INSTR(TinderUsage.FilePath, '/')
      ) = SUBSTR(
        TinderOrientation.FilePath,
        0,
        INSTR(TinderOrientation.FilePath, '/')
      )
  )
GROUP BY
  app
