WITH
  Losers AS(
    SELECT
      DISTINCT loserLatitude AS latitude,
      loserLongitude AS longitude,
      loserName AS name,
      SUBSTR(
        OtherCandidate.FilePath,
        0,
        INSTR(OtherCandidate.FilePath, '/')
      ) AS uniqueId
    FROM
      OtherCandidate
    WHERE
      loserSemanticType = "TYPE_SEARCHED_ADDRESS"
  ),
  Winners AS(
    SELECT
      DISTINCT winnerLatitude AS latitude,
      winnerLongitude AS longitude,
      winnerName AS name,
      SUBSTR(
        OtherCandidate.FilePath,
        0,
        INSTR(OtherCandidate.FilePath, '/')
      ) AS uniqueId
    FROM
      OtherCandidate,
      KAnonymity
    WHERE
      winnerSemanticType = "TYPE_SEARCHED_ADDRESS"
  )
SELECT
  latitude,
  longitude,
  name,
  k
FROM
  (
    SELECT
      DISTINCT *
    FROM
      (
        SELECT
          *
        FROM
          Losers
        UNION
        SELECT
          *
        FROM
          Winners
      ) a
  ) b,
  KAnonymity
WHERE
  b.uniqueId = SUBSTR(
    KAnonymity.FilePath,
    0,
    INSTR(KAnonymity.FilePath, '/')
  )
