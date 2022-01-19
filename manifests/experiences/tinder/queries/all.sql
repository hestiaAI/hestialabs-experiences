SELECT  date,
        MAX(CASE WHEN action='swipe_like'THEN amount ELSE NULL END) like,
        MAX(CASE WHEN action='superlikes'THEN amount ELSE NULL END) number_of_superlike,
        MAX(CASE WHEN action='swipe_pass'THEN amount ELSE NULL END) pass,
        MAX(CASE WHEN action='messages_sent'THEN amount ELSE NULL END) number_of_messages_sent,
        MAX(CASE WHEN action='messages_received'THEN amount ELSE NULL END) number_of_messages_received,
        MAX(CASE WHEN action='matches'THEN amount ELSE NULL END) number_of_match,        
        MAX(CASE WHEN action='app_open'THEN amount ELSE NULL END) open
FROM TinderDB
GROUP BY date;


/*
  ?date 
  ?pass 
  ?like 
  ?open 
?number_of_match 
  ?number_of_messages_received 
  ?number_of_messages_sent 
?number_of_superlike
*/
