SELECT
  mac,
  AVG(latitude) AS latitude,
  AVG(longitude) AS longitude,
  COUNT(*) AS number_of_detections
FROM
  WifiScan
  INNER JOIN MacAdresses ON WifiScan.id = MacAdresses.macId
GROUP BY
  mac
ORDER BY
  COUNT() DESC
