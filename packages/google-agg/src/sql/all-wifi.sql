SELECT mac, latitude, longitude, k
FROM Wifi, KAnonymity
WHERE SUBSTR(Wifi.FilePath, 0, INSTR(Wifi.FilePath, '/')) = SUBSTR(KAnonymity.FilePath, 0, INSTR(KAnonymity.FilePath, '/'))
