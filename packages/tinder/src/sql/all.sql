SELECT
  dateValue,
  MAX(
    CASE
      WHEN actionType = 'swipes_likes' THEN amount
      ELSE 0
    END
  ) likes,
  MAX(
    CASE
      WHEN actionType = 'superlikes' THEN amount
      ELSE 0
    END
  ) number_of_superlikes,
  MAX(
    CASE
      WHEN actionType = 'swipes_passes' THEN amount
      ELSE 0
    END
  ) passes,
  MAX(
    CASE
      WHEN actionType = 'messages_sent' THEN amount
      ELSE 0
    END
  ) number_of_messages_sent,
  MAX(
    CASE
      WHEN actionType = 'messages_received' THEN amount
      ELSE 0
    END
  ) number_of_messages_received,
  MAX(
    CASE
      WHEN actionType = 'matches' THEN amount
      ELSE 0
    END
  ) number_of_matches,
  MAX(
    CASE
      WHEN actionType = 'app_opens' THEN amount
      ELSE 0
    END
  ) opens
FROM
  TinderUsage
GROUP BY
  dateValue;
