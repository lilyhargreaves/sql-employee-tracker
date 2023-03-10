INSERT INTO department (name)
VALUES ('Marketing'), 
        ('Ecommerce'), 
        ('Design'), 
        ('Supply Chain'); 

INSERT INTO role (title, salary, department_id)
VALUES ('Marketing Manager', 100000, 1), 
        ('Marketing Coordinator', 60000, 1), 
        ('Ecommerce Manager', 80000, 2), 
        ('Customer Service Assistant', 50000, 2), 
        ('Head of Design', 120000, 3), 
        ('Senior Designer', 90000, 3), 
        ('Supply Chain Manager', 250000, 4), 
        ('Logistics Assistant', 65000, 4); 

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('John', 'Smith', 1, null),
        ('Joshua', 'Sugar', 2, 1),
        ('Melvin', 'Breeze', 3, null),
        ('Catie', 'Writer', 4, 3),
        ('Georgia', 'Pimms', 5, null),
        ('Kalia', 'Wandsy', 6, 5),
        ('Nicholas', 'Peeper', 7, null),
        ('William', 'Colas', 8, 7); 