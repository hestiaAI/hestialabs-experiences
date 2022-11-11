SELECT category,
       typeOfInference,
       description,
       inference,
       COUNT(*) AS _count
FROM Inference
GROUP BY category, typeOfInference, description, inference
ORDER BY _count DESC;
