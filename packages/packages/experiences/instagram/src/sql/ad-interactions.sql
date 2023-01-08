SELECT title, DATETIME(ROUND(unixTimestamp), 'unixepoch') AS _date, 'True' as clicked FROM InstagramAdClicked
UNION
SELECT accountName as title, datetime AS _date, 'False' as clicked FROM InstagramAdViewed;
