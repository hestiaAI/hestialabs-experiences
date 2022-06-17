SELECT SUBSTR(messageSentAt, 0, INSTR(messageSentAt, ' ')) AS date, 
  SUM(CASE WHEN HerMessage.sender = 'User' THEN 1 ELSE 0 END) messagesSent,
  SUM(CASE WHEN HerMessage.sender != 'User' AND HerMessage.sender != 'Her' THEN 1 ELSE 0 END) messagesReceived,
  SUBSTR(FilePath, 0, INSTR(FilePath, '/')) AS userId
FROM HerMessage
WHERE HerMessage.messageType = 'Message'
GROUP BY date, FilePath
