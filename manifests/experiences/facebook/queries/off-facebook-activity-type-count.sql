SELECT name AS targetingType, type AS targetingValue, COUNT(*) as count
FROM offFacebookActivityDatabase
WHERE targetingType in (SELECT name
  FROM offFacebookActivityDatabase
  GROUP BY name
  ORDER BY COUNT(*) DESC
  LIMIT 10)
GROUP BY targetingType, targetingValue
