SELECT dateValue, amount, 'App opened' AS actionType
FROM TinderUsage
WHERE actionType = 'app_opens';
