SELECT  date,
        MAX(CASE WHEN action='swipes_likes'THEN amount ELSE NULL END) likes,
        MAX(CASE WHEN action='swipes_passes'THEN amount ELSE NULL END) pass,
        MAX(CASE WHEN action='messages_sent'THEN amount ELSE NULL END) msg_sent,
        MAX(CASE WHEN action='messages_received'THEN amount ELSE NULL END) msg_rcv
FROM Tinder
GROUP BY date;
