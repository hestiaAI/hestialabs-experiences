SELECT
  startLatitude,
  startLongitude,
  endLatitude,
  endLongitude,
  transitPath,
  k
FROM
  Travels,
  KAnonymity
WHERE
  transitPath != 'null'
  AND SUBSTR(Travels.filePath, 0, INSTR(Travels.filePath, '/')) = SUBSTR(
    KAnonymity.filePath,
    0,
    INSTR(KAnonymity.filePath, '/')
  )
