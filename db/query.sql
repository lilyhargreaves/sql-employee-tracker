-- functionality to view all employees --
SELECT employee.id, employee.first_name, employee.last_name, title, department.name AS department, salary, CONCAT(e.first_name, ' ', e.last_name) AS manager
FROM employee
JOIN role ON employee.role_id = role.id
JOIN department ON role.department_id = department.id
LEFT JOIN employee e ON employee.manager_id = e.id;

-- functionality to view all managers --
SELECT id, first_name, last_name FROM employee WHERE manager_id IS NULL;

-- functionality to add new employees --
INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES 
        (first_name, last_name, role_id, manager_id);

-- functionality to update employee role --
UPDATE employee
SET role_id =
WHERE id = ;

-- functionality to view all roles --
SELECT title, role.id AS role_id, department.name AS department, salary
FROM role
JOIN department ON role.department_id = department.id;

-- functionality to add roles --
INSERT INTO role (title, salary, department_id)
    VALUES 
        (title, salary, department_id);

-- functionality to view all departments --
SELECT * department;

-- functionality to add departments --
INSERT INTO department (name)
    VALUES
        (name);