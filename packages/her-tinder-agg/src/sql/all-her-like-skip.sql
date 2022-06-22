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
  SUBSTR(
    HerLikeSkip.filePath,
    0,
    INSTR(HerLikeSkip.filePath, '_')
  ) AS app,
  'Queer' AS sexualOrientations,
  SUBSTR(filePath, 0, INSTR(filePath, '/')) AS userId
FROM
  HerLikeSkip
GROUP BY
  DATE,
  filePath
