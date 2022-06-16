SELECT
  dateValue,
  MAX(
    CASE
      WHEN actionType = 'swipes_likes' THEN amount
      ELSE NULL
    END
  ) likes,
  MAX(
    CASE
      WHEN actionType = 'swipes_passes' THEN amount
      ELSE NULL
    END
  ) passes,
  MAX(
    CASE
      WHEN actionType = 'app_opens' THEN amount
      ELSE NULL
    END
  ) opens
FROM
  TinderUsage
GROUP BY
  dateValue;
