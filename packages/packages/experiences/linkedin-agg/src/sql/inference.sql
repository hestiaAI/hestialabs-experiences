SELECT
  category,
  typeOfInference,
  description,
  inference,
  SUBSTR(filepath, 0, INSTR(filepath, '/')),
  COUNT(*) AS _count,
  (
    SELECT
      COUNT(*)
    FROM
      (
        SELECT
          *
        FROM
          Inference
        GROUP BY
          SUBSTR(filepath, 0, INSTR(filepath, '/'))
      )
  ) _total_profiles
FROM
  Inference
GROUP BY
  category,
  typeOfInference,
  description,
  inference
ORDER BY
  _count DESC,
  inference DESC;
