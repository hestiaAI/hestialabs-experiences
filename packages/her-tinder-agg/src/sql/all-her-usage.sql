SELECT *
FROM
  (
    SELECT SUBSTR(messageSentAt, 0, INSTR(messageSentAt, ' ')) AS date, 
      SUM(CASE WHEN HerMessage.sender = 'User' THEN 1 ELSE 0 END) messagesSent,
      SUM(CASE WHEN HerMessage.sender != 'User' THEN 1 ELSE 0 END) messagesReceived,
      SUBSTR(FilePath, 0, INSTR(FilePath, '/')) AS userId
    FROM HerMessage
    WHERE HerMessage.messageType = 'Message'
    GROUP BY date, FilePath
  ) as Messages,
  (
    SELECT date,
      SUM(CASE WHEN HerLikeSkip.action = 'Like' THEN HerLikeSkip.count ELSE 0 END) likes,
      SUM(CASE WHEN HerLikeSkip.action = 'Skip' THEN HerLikeSkip.count ELSE 0 END) passes,
      SUBSTR(HerLikeSkip.FilePath, 0, INSTR(HerLikeSkip.FilePath, '_')) AS app, 
      'Queer' as sexualOrientations,
       SUBSTR(FilePath, 0, INSTR(FilePath, '/')) AS userId
    FROM HerLikeSkip
    GROUP BY date, FilePath
    ORDER BY date, FilePath
  ) as LikesPasses,
  (
    SELECT SUBSTR(likedAt, 0, INSTR(likedAt, 'T')) AS date, 
      COUNT(HerLikeMatch.matched) as matches,
      SUBSTR(FilePath, 0, INSTR(FilePath, '/')) AS userId
    FROM HerLikeMatch
    WHERE HerLikeMatch.matched = "true"
    GROUP BY date, FilePath
  ) as Matches
WHERE Messages.date = LikesPasses.date
  AND Messages.date = Matches.date
  AND Messages.userId = LikesPasses.userId
  AND Messages.userId = Matches.userId
