SELECT
  DISTINCT latitude,
  longitude,
  PlaceVisit.address,
  PlaceVisit.name,
  k
FROM
  PlaceVisit,
  KAnonymity
WHERE
  SUBSTR(
    PlaceVisit.filePath,
    0,
    INSTR(PlaceVisit.filePath, '/')
  ) = SUBSTR(
    KAnonymity.filePath,
    0,
    INSTR(KAnonymity.filePath, '/')
  )
