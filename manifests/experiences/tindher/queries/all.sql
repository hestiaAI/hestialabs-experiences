SELECT  date,
        MAX(CASE WHEN action='swipes_likes'THEN amount ELSE 0 END) likes,
        MAX(CASE WHEN action='superlikes'THEN amount ELSE 0 END) number_of_superlikes,
        MAX(CASE WHEN action='swipes_passes'THEN amount ELSE 0 END) passes,
        MAX(CASE WHEN action='messages_sent'THEN amount ELSE 0 END) number_of_messages_sent,
        MAX(CASE WHEN action='messages_received'THEN amount ELSE 0 END) number_of_messages_received,
        MAX(CASE WHEN action='matches'THEN amount ELSE 0 END) number_of_matches,
        MAX(CASE WHEN action='app_opens'THEN amount ELSE 0 END) open
FROM Tinder
GROUP BY date;
