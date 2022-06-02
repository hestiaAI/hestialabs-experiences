SELECT Records.latitude, Records.longitude, Records.timestamp, Records.accuracy, Records.source, ActivitySegment.activityType
FROM Records, ActivitySegment
WHERE Records.timestamp >= ActivitySegment.startTimestamp AND Records.timestamp <= ActivitySegment.endTimestamp