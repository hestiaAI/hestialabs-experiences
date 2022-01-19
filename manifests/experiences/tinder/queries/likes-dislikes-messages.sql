SELECT  date,
        MAX(CASE WHEN action='swipe_like'THEN amount ELSE NULL END) likes,
        MAX(CASE WHEN action='swipe_pass'THEN amount ELSE NULL END) pass,
        MAX(CASE WHEN action='messages_sent'THEN amount ELSE NULL END) msg_sent,
        MAX(CASE WHEN action='messages_received'THEN amount ELSE NULL END) msg_rcv
FROM TinderDB
GROUP BY date;
