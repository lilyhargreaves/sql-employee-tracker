INSERT INTO department (name)
VALUES ('Marketing'), 
        ('Sales'), 
        ('Finance'), 
        ('Logistics'); 

INSERT INTO role (title, salary, department_id)
VALUES ('Marketing Manager', 100000, 1), 
        ('Marketing Coordinator', 60000, 1), 
        ('Sales Manager', 80000, 2), 
        ('Sales Coordinator', 50000, 2), 
        ('Chief Financial Officer', 220000, 3), 
        ('Bookkeeper', 45000, 3), 
        ('Logistics Manager', 150000, 4), 
        ('Logistics Assistant', 65000, 4); 

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('John', 'Smith', 1, null),
        ('Katrina', 'Sugar', 2, 1),
        ('Melvin', 'Breeze', 3, null),
        ('Catie', 'Writer', 4, 3),
        ('Georgia', 'Palms', 5, null),
        ('Matthew', 'Wander', 6, 5),
        ('Megan', 'Jones', 7, null),
        ('Christopher', 'Cola', 8, 7); 