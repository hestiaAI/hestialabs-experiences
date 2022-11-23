SELECT
  *
FROM
  (
    SELECT
      *,
      RANK() OVER(
        PARTITION BY emailAddress,
        firstName,
        lastName
        ORDER BY
          rowid
      ) rank
    FROM
      Connection
  )
WHERE
  rank = 1;
