SELECT
  SUBSTR(messageSentAt, 0, INSTR(messageSentAt, ' ')) AS DATE,
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
  DATE,
  filePath
