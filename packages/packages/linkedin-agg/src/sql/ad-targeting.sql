

WITH RECURSIVE
  splitJobSeniorities(filePath, targetingType, targetingValue, str) AS (
    SELECT filePath, "jobSeniorities", '', jobSeniorities||';' FROM AdTargeting
    UNION ALL SELECT
    filePath,
    "jobSeniorities",
    substr(str, 0, instr(str, ';')),
    substr(str, instr(str, ';')+1)
    FROM splitJobSeniorities WHERE str!=''
  ),
  splitMemberSkills(filePath, targetingType, targetingValue, str) AS (
    SELECT filePath, "memberSkills", '', memberSkills||';' FROM AdTargeting
    UNION ALL SELECT
    filePath,
    "memberSkills",
    substr(str, 0, instr(str, ';')),
    substr(str, instr(str, ';')+1)
    FROM splitMemberSkills WHERE str!=''
  ),
  splitYearsOfExperience(filePath, targetingType, targetingValue, str) AS (
    SELECT filePath, "yearsOfExperience", '', yearsOfExperience||';' FROM AdTargeting
    UNION ALL SELECT
    filePath,
    "yearsOfExperience",
    substr(str, 0, instr(str, ';')),
    substr(str, instr(str, ';')+1)
    FROM splitYearsOfExperience WHERE str!=''
  ),
  splitDegrees(filePath, targetingType, targetingValue, str) AS (
    SELECT filePath, "degrees", '', degrees||';' FROM AdTargeting
    UNION ALL SELECT
    filePath,
    "degrees",
    substr(str, 0, instr(str, ';')),
    substr(str, instr(str, ';')+1)
    FROM splitDegrees WHERE str!=''
  ),
  splitFieldsOfStudy(filePath, targetingType, targetingValue, str) AS (
    SELECT filePath, "fieldsOfStudy", '', fieldsOfStudy||';' FROM AdTargeting
    UNION ALL SELECT
    filePath,
    "fieldsOfStudy",
    substr(str, 0, instr(str, ';')),
    substr(str, instr(str, ';')+1)
    FROM splitFieldsOfStudy WHERE str!=''
  ),
  splitMemberSchools(filePath, targetingType, targetingValue, str) AS (
    SELECT filePath, "memberSchools", '', memberSchools||';' FROM AdTargeting
    UNION ALL SELECT
    filePath,
    "memberSchools",
    substr(str, 0, instr(str, ';')),
    substr(str, instr(str, ';')+1)
    FROM splitMemberSchools WHERE str!=''
  )
SELECT filePath, targetingValue, targetingType
FROM splitJobSeniorities
WHERE targetingValue!=''
UNION
SELECT filePath, targetingValue, targetingType
FROM splitMemberSkills
WHERE targetingValue!=''
UNION
SELECT filePath, targetingValue, targetingType
FROM splitYearsOfExperience
WHERE targetingValue!=''
UNION
SELECT filePath, targetingValue, targetingType
FROM splitDegrees
WHERE targetingValue!=''
UNION
SELECT filePath, targetingValue, targetingType
FROM splitFieldsOfStudy
WHERE targetingValue!=''
UNION
SELECT filePath, targetingValue, targetingType
FROM splitMemberSchools
WHERE targetingValue!='';
