SELECT
  mac,
  AVG(latitude) AS latitude,
  AVG(longitude) AS longitude,
  COUNT(*) AS number_of_detections
FROM
  WifiScan
  INNER JOIN MacAdresses ON WifiScan.id = MacAdresses.macId
WHERE latitude IS NOT NULL
  AND longitude IS NOT NULL
GROUP BY
  mac
ORDER BY
  COUNT() DESC;
