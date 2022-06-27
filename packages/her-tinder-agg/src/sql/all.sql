SELECT
  Messages.dateValue,
  LikesPasses.likes,
  LikesPasses.passes,
  Messages.messagesSent,
  Messages.messagesReceived,
  Matches.matches,
  LikesPasses.app,
  LikesPasses.sexualOrientations,
  Messages.userId
FROM
  (
    SELECT
      SUBSTR(messageSentAt, 0, INSTR(messageSentAt, ' ')) AS dateValue,
      SUM(
        CASE
          WHEN HerMessage.sender = 'User' THEN 1
          ELSE 0
        END
      ) messagesSent,
      SUM(
        CASE
          WHEN HerMessage.sender != 'User'
          AND HerMessage.sender != 'Her' THEN 1
          ELSE 0
        END
      ) messagesReceived,
      SUBSTR(filePath, 0, INSTR(filePath, '/')) AS userId
    FROM
      HerMessage
    WHERE
      HerMessage.messageType = 'Message'
    GROUP BY
      dateValue,
      filePath
  ) Messages,
  (
    SELECT
      dateValue,
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
        HerLikeSkip.FilePath,
        0,
        INSTR(HerLikeSkip.FilePath, '_')
      ) AS app,
      'qur' AS sexualOrientations,
      SUBSTR(FilePath, 0, INSTR(FilePath, '/')) AS userId
    FROM
      HerLikeSkip
    GROUP BY
      dateValue,
      FilePath
  ) LikesPasses,
  (
    SELECT
      SUBSTR(likedAt, 0, INSTR(likedAt, ' ')) AS dateValue,
      COUNT(HerLikeMatch.matched) AS matches,
      SUBSTR(filePath, 0, INSTR(filePath, '/')) AS userId
    FROM
      HerLikeMatch
    WHERE
      HerLikeMatch.matched = "true"
    GROUP BY
      dateValue,
      filePath
  ) Matches
WHERE
  Messages.dateValue = LikesPasses.dateValue
  AND Messages.dateValue = Matches.dateValue
  AND Messages.userId = LikesPasses.userId
  AND Messages.userId = Matches.userId
UNION ALL
SELECT
  TinderUsage.dateValue,
  likes,
  passes,
  messagesSent,
  messagesReceived,
  matches,
  SUBSTR(
    TinderUsage.filePath,
    0,
    INSTR(TinderUsage.filePath, '_')
  ) AS app,
  sexualOrientations,
  SUBSTR(
    TinderUsage.filePath,
    0,
    INSTR(TinderUsage.filePath, '/')
  ) AS userId
FROM
  TinderUsage,
  TinderOrientation
WHERE
  SUBSTR(
    TinderUsage.filePath,
    0,
    INSTR(TinderUsage.filePath, '/')
  ) = SUBSTR(
    TinderOrientation.filePath,
    0,
    INSTR(TinderOrientation.filePath, '/')
  )
