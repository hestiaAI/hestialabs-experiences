SELECT
  mac,
  latitude,
  longitude,
  k
FROM
  Wifi,
  KAnonymity
WHERE
  SUBSTR(Wifi.filePath, 0, INSTR(Wifi.filePath, '/')) = SUBSTR(
    KAnonymity.filePath,
    0,
    INSTR(KAnonymity.filePath, '/')
  )
