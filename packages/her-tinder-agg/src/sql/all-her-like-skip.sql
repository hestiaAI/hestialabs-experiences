SELECT date,
  SUM(CASE WHEN HerLikeSkip.action = 'Like' THEN HerLikeSkip.count ELSE 0 END) likes,
  SUM(CASE WHEN HerLikeSkip.action = 'Skip' THEN HerLikeSkip.count ELSE 0 END) passes,
  SUBSTR(HerLikeSkip.FilePath, 0, INSTR(HerLikeSkip.FilePath, '_')) AS app, 
  'Queer' as sexualOrientations,
    SUBSTR(FilePath, 0, INSTR(FilePath, '/')) AS userId
FROM HerLikeSkip
GROUP BY date, FilePath
