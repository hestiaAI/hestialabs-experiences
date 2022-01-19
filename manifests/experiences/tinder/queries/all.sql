SELECT  date,
        MAX(CASE WHEN action='swipe_like'THEN amount ELSE NULL END) likes,
        MAX(CASE WHEN action='superlikes'THEN amount ELSE NULL END) number_of_superlikes,
        MAX(CASE WHEN action='swipe_pass'THEN amount ELSE NULL END) passes,
        MAX(CASE WHEN action='messages_sent'THEN amount ELSE NULL END) number_of_messages_sent,
        MAX(CASE WHEN action='messages_received'THEN amount ELSE NULL END) number_of_messages_received,
        MAX(CASE WHEN action='matches'THEN amount ELSE NULL END) number_of_matches,        
        MAX(CASE WHEN action='app_open'THEN amount ELSE NULL END) open
FROM TinderDB
GROUP BY date;
