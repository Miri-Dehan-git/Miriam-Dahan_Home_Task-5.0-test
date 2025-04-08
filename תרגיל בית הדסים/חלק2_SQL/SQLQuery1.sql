CREATE DATABASE FamilyTreeDB;
--DROP DATABASE FamilyTreeDB;

USE FamilyTreeDB;

CREATE TABLE PEOPLE (
    Person_Id INT PRIMARY KEY,
    Personal_Name VARCHAR(50),
    Family_Name VARCHAR(50),
    Gender VARCHAR(10),
    Father_Id INT,
    Mother_Id INT,
    Spouse_Id INT
);


INSERT INTO PEOPLE (Person_Id, Personal_Name, Family_Name, Gender, Father_Id, Mother_Id, Spouse_Id) VALUES
(1, '���', '���', '���', NULL, NULL, 2),
(2, '���', '���', '����', NULL, NULL, 1),
(3, '���', '���', '����', 1, 2, NULL),
(4, '��', '���', '���', 1, 2, 5),
(5, '���', '���', '����', NULL, NULL, NULL),
(6, '����', '���', '����', 4, 5, NULL);


--����� 1
CREATE TABLE FAMILYTREE (
    Person_Id INT,
    Relative_Id INT,
    Connection_Type VARCHAR(20)
);

INSERT INTO FAMILYTREE (Person_Id, Relative_Id, Connection_Type)
SELECT
    P.Person_Id,
    P.Father_Id AS Relative_Id,
    '��' AS Connection_Type
FROM PEOPLE P
WHERE P.Father_Id IS NOT NULL

UNION

SELECT
    P.Person_Id,
    P.Mother_Id AS Relative_Id,
    '��' AS Connection_Type
FROM PEOPLE P
WHERE P.Mother_Id IS NOT NULL

UNION

SELECT
    P.Person_Id,
    P.Spouse_Id AS Relative_Id,
    CASE P.Gender
        WHEN '���' THEN '�� ���'
        WHEN '����' THEN '�� ���'
        ELSE '��/�� ���'
    END AS Connection_Type
FROM PEOPLE P
WHERE P.Spouse_Id IS NOT NULL

UNION

SELECT
    P1.Person_Id,
    P2.Person_Id AS Relative_Id,
    CASE P2.Gender
        WHEN '���' THEN '��'
        WHEN '����' THEN '����'
        ELSE '��/����'
    END AS Connection_Type
FROM PEOPLE P1
JOIN PEOPLE P2
    ON P1.Person_Id <> P2.Person_Id
   AND P1.Father_Id = P2.Father_Id
   AND P1.Mother_Id = P2.Mother_Id
WHERE P1.Father_Id IS NOT NULL AND P1.Mother_Id IS NOT NULL

UNION

SELECT
    P.Person_Id,
    C.Person_Id AS Relative_Id,
    CASE C.Gender
        WHEN '���' THEN '��'
        WHEN '����' THEN '��'
        ELSE '��/��'
    END AS Connection_Type
FROM PEOPLE P
JOIN PEOPLE C
    ON C.Father_Id = P.Person_Id OR C.Mother_Id = P.Person_Id;
	--����� 2

INSERT INTO FAMILYTREE (Person_Id, Relative_Id, Connection_Type)
SELECT
    p.Spouse_Id AS Person_Id,
    p.Person_Id AS Relative_Id,
    CASE 
        WHEN p.Gender = '���' THEN '�� ���'
        WHEN p.Gender = '����' THEN '�� ���'
        ELSE '��/�� ���'
    END AS Connection_Type
FROM PEOPLE p
WHERE p.Spouse_Id IS NOT NULL
AND NOT EXISTS (
    SELECT 1
    FROM FAMILYTREE f
    WHERE f.Person_Id = p.Spouse_Id
      AND f.Relative_Id = p.Person_Id
      AND f.Connection_Type IN ('�� ���', '�� ���', '��/�� ���')
);
