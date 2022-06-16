SELECT date,
  SUM(CASE WHEN HerLikeSkip.action = 'Like' THEN HerLikeSkip.count ELSE 0 END) likes,
  SUM(CASE WHEN HerLikeSkip.action = 'Skip' THEN HerLikeSkip.count ELSE 0 END) passes,
  SUBSTR(HerLikeSkip.FilePath, 0, INSTR(HerLikeSkip.FilePath, '_')) AS app, 
  'Queer' as sexualOrientations,
  FilePath
FROM HerLikeSkip
GROUP BY date, FilePath
ORDER BY date, FilePath;
