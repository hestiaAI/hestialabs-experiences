WITH
  EngagementCount AS (
    SELECT
      a.tweetId,
      a.advertiserName,
      a.displayLocation,
      a.time,
      COUNT(*) AS count_
    FROM
      TwitterAd a,
      TwitterEngagement e
    WHERE
      a.tweetId = e.tweetId
      AND a.advertiserName = e.advertiserName
      AND a.displayLocation = e.displayLocation -- We only consider engagements that occur
      -- within 120 sec of a corresponding impression.
      -- 60 sec x 60 min x 24 hours = 86,400 sec
      AND ABS(
        ROUND((JULIANDAY(a.time) - JULIANDAY(e.time)) * 86400)
      ) < 120
    GROUP BY
      a.tweetId,
      a.advertiserName,
      a.displayLocation,
      a.time
  ),
  Engagement AS (
    SELECT
      a.tweetId,
      a.advertiserName AS companyName,
      -- Return 0 if ad has no engagements
      IFNULL(
        (
          SELECT
            ec.count_
          FROM
            EngagementCount ec
          WHERE
            a.tweetId = ec.tweetId
            AND a.advertiserName = ec.advertiserName
            AND a.displayLocation = ec.displayLocation
            AND a.time = ec.time
        ),
        0
      ) engagements,
      a.time AS date_,
      c.targetingType,
      c.targetingValue
    FROM
      TwitterAd a
      INNER JOIN TwitterCriterion c ON a.id = c.adId
    WHERE
      a.time > date('now', '-1 month')
  )
SELECT
  (
    -- Yes/No is interpreted as BOOLEAN by type-check.js
    CASE
      WHEN e.engagements IS 0 THEN 'No'
      ELSE 'Yes'
    END
  ) AS engagedWith,
  e.*
FROM
  Engagement e
