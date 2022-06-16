SELECT date, 
  likes, 
  passes, 
  messagesSent, 
  messagesReceived, 
  matches, 
  SUBSTR(TinderUsage.FilePath, 0, INSTR(TinderUsage.FilePath, '_')) AS app, 
  sexualOrientations,
  SUBSTR(TinderUsage.FilePath, 0, INSTR(TinderUsage.FilePath, '/')) AS userId
FROM TinderUsage, TinderOrientation
WHERE SUBSTR(TinderUsage.FilePath, 0, INSTR(TinderUsage.FilePath, '/')) = SUBSTR(TinderOrientation.FilePath, 0, INSTR(TinderOrientation.FilePath, '/'))
