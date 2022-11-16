SELECT
  *
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
        HerLikeSkip.filePath,
        0,
        INSTR(HerLikeSkip.filePath, '_')
      ) AS app,
      'Queer' AS sexualOrientations,
      SUBSTR(filePath, 0, INSTR(filePath, '/')) AS userId
    FROM
      HerLikeSkip
    GROUP BY
      dateValue,
      filePath
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
