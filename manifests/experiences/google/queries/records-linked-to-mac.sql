SELECT mac, Avg(latitude) as latitude, Avg(longitude) as longitude, COUNT(*) as count
FROM WifiScan INNER JOIN MacAdresses
  ON WifiScan.id = MacAdresses.macId
GROUP BY mac;
