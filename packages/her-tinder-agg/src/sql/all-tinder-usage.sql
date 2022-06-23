SELECT
  TinderUsage.date,
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
