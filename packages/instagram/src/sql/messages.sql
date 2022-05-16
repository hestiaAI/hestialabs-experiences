SELECT senderName, messageContent, DATETIME(ROUND(timestampMS / 1000), 'unixepoch') AS sendDatetime FROM InstagramMessage;
