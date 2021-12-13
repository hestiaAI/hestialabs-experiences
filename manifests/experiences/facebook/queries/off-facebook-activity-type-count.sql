/* This one works but it is not what we want */
SELECT name AS targetingType, type AS targetingValue, COUNT(*) as count
FROM offFacebookActivityDatabase
GROUP BY targetingType, targetingValue
ORDER BY count DESC
LIMIT 10;


/* These ones are what we want but they do no work */
/*
SELECT name AS targetingType, type AS targetingValue, COUNT(*) as count
FROM offFacebookActivityDatabase
WHERE targetingType IN (
  SELECT name AS targetingType
  FROM offFacebookActivityDatabase
  GROUP BY targetingType
  ORDER BY COUNT(*) DESC
  LIMIT 10;
)
GROUP BY targetingType, targetingValue;
*/

/*
SELECT name AS targetingType, type AS targetingValue, COUNT(*) as count
FROM (
  SELECT name AS targetingType, type AS targetingValue, COUNT(*) as countWorseApps
  FROM offFacebookActivityDatabase
  GROUP BY targetingType
  ORDER BY countWorseApps DESC
  LIMIT 10;
)
GROUP BY targetingType, targetingValue;
*/
