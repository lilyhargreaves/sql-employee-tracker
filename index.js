// import application dependencies
const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");

// define the mysql connection
const db = mysql.createConnection (
    {
        host: "localhost",
        user: "root",
        password: "",
        database: "employee_db"
    }
);

// function to initialise the application
start = () => {

    const initialQuestion = [
        {
            type: "list",
            message: "What would you like to do?",
            name: "mainMenu",
            choices: ["View All Employees", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department", "Exit Application"]
        }
    ]

    // show main menu on initialisation
    inquirer
        .prompt(initialQuestion)

        .then(response => {

            if (response.mainMenu === "View All Employees"){
                viewAllEmployees();  
            } 
            else if (response.mainMenu === "Add Employee"){
                addEmployee();
            } 
            else if (response.mainMenu === "Update Employee Role"){
                updateEmployeeRole();
            } 
            else if (response.mainMenu === "View All Roles"){
                viewAllRoles();
            }
            else if (response.mainMenu === "Add Role"){
                addRole();
            }
            else if (response.mainMenu === "View All Departments"){
                viewAllDepartments();
            }
            else if (response.mainMenu === "Add Department"){
                addDepartment();
            }
            else db.end();
        })
}

// define function to show all employees in the database
viewAllEmployees = () => {
    db.query(`SELECT employee.id, employee.first_name, employee.last_name, title, department.name AS department, salary, CONCAT(e.first_name, ' ', e.last_name) AS manager
FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id LEFT JOIN employee e ON employee.manager_id = e.id;`, (err, res) => {
        if (err) {
            return console.log(err);
          }
        console.table(res);
        start();
    })
};

// define function to add an employee to the database
addEmployee = () => {
    const getRolesFromDB = new Promise( (resolve, reject) => {
        db.query(`SELECT title, id FROM role`, (err, res) => {
            if (res) {
                resolve(res)
            } else {
                reject("Something went wrong");
            }
        })
    });

    const getManagersFromDB = new Promise( (resolve, reject) => {
        db.query('SELECT first_name, last_name, id FROM employee WHERE manager_id IS NULL', (err, res) => {
            if (res) {
                resolve(res)
            } else {
                reject("Something went wrong");
            }
        })
    });
    

    Promise.all([getRolesFromDB, getManagersFromDB])
    .then((values) => {

        let roleTitles = values[0].map(function(results) {
            return results.title; 
        })

        let managers = values[1].map(function(manager) {
            return manager.first_name + " " + manager.last_name; 
        })

        managers.push("This employee does not have a manager.");

        const addEmployeeQuestions = [
            {
                type: "input",
                message: "What is the employee's first name?",
                name: "firstName"
            },
            {
                type: "input",
                message: "What is the employee's last name?",
                name: "lastName"
            },
            {
                type: "list",
                message: "What is the employee's role?",
                name: "employeeRole",
                choices: roleTitles
            },
            {
                type: "list",
                message: "Who is the employee's manager?",
                name: "employeeManager",
                choices: managers
            },
        ]

        inquirer
            .prompt(addEmployeeQuestions)

            .then(response => {
                
                let chosenRole = response.employeeRole;
                let chosenManager = response.employeeManager;
                                
                let roleIndexNumber = values[0].findIndex(function(role) {
                    return chosenRole === role.title;
                })  

                let thisRoleId = values[0][roleIndexNumber].id;

                 let managerIndexNumber = values[1].findIndex(function(manager) {
                    return chosenManager === manager.first_name + " " + manager.last_name;
                })  

                let thisManagerId = (managerIndexNumber === -1) ? null : values[1][managerIndexNumber].id;

         
                db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [response.firstName, response.lastName, thisRoleId, thisManagerId], (err, results) => {
                    if (err) {
                        return console.log(err);
                      }
                    console.log("Added " + response.firstName + " " + response.lastName + " to the database.")
                    
                    start();
                })
            })
    })
    .catch( err => 
        console.log(err));  
};

// define function to update an employee's role in the database
updateEmployeeRole = () => {
    const getEmployeesFromDB = new Promise( (resolve, reject) => { 
        db.query(`SELECT first_name, last_name, id FROM employee`, (err, res) => {
            if (res) {
                resolve(res)
            } else {
                reject("Something went wrong");
            }
        })
    });

    const getRolesFromDB = new Promise( (resolve, reject) => {
        db.query(`SELECT title, id FROM role`, (err, res) => {   
            if (res) {
                resolve(res)
            } else {
                reject("Something went wrong");
            }
        })
    });

    Promise.all([getEmployeesFromDB, getRolesFromDB])
    .then((values) => {
        
        let currentEmployees = values[0].map(function(employee) {
            return employee.first_name + " " + employee.last_name;
        })

        let currentRoles = values[1].map(function(employee) {
            return employee.title;
        })

        const updateEmployeeRoleQuestions = [
            {
                type: "list",
                message: "Which employee's role would you like to update?",
                name: "employeeToUpdate",
                choices: currentEmployees
            },
            {
                type: "list",
                message: "Which role would you like to assign to chosen employee?",
                name: "updatedRole",
                choices: currentRoles
            }
        ]

        inquirer    
            .prompt(updateEmployeeRoleQuestions)

            .then(response => { 

                let chosenEmployee = response.employeeToUpdate;
                let chosenRole = response.updatedRole;

                let employeeIndexNumber = values[0].findIndex(function(employee) {
                    return chosenEmployee === employee.first_name + " " + employee.last_name;
                })

                let thisEmployeeId = values[0][employeeIndexNumber].id;


                let roleIndexNumber = values[1].findIndex(function(role){
                    return chosenRole === role.title;
                })

                let thisRoleId = values[1][roleIndexNumber].id;

                db.query(`UPDATE employee SET role_id = (?) WHERE id= (?)`, [thisRoleId, thisEmployeeId], (err, results) => {
                    if (err) {
                        return console.log(err);
                      }
                    console.log("Updated " + chosenEmployee + " in the database.")
                    
                    start();
                })
            })
    })
}

// define function to show all roles in the database
viewAllRoles = () => {
    db.query(`SELECT title, role.id AS role_id, department.name AS department, salary FROM role JOIN department ON role.department_id = department.id`, (err, res) => {
        if (err) {
            return console.log(err);
          }
        console.table(res);
        start();
    })
};

// define function to add a role to the database
addRole = () => {
    const getDepartmentsFromDB = new Promise( (resolve, reject) => {
        db.query(`SELECT name, id FROM department`, (err, res) => {
            if (res) {
                resolve(res)
            } else {
                reject("Something went wrong");
            }
        })
    })
    
    getDepartmentsFromDB
    .then((values) => {

        let departments = values.map(function(results) {
            return results.name;
        })        

        const addRoleQuestions = [
            {
                type: "input",
                message: "What is the name of the role?",
                name: "roleName"
            },
            {
                type: "input",
                message: "What is the salary of the role?",
                name: "roleSalary"
            },
            {
                type: "list",
                message: "Which department does the role belong to?",
                name: "roleDepartment",
                choices: departments
            },
        ]

        inquirer
            .prompt(addRoleQuestions)

            .then(response => {

                let chosenDepartment = response.roleDepartment;

                let departmentIndexNumber = values.findIndex(function(department){
                    return chosenDepartment === department.name;
                })

                let thisDepartmentId = values[departmentIndexNumber].id;

                db.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, [response.roleName, response.roleSalary, thisDepartmentId], (err, res) => {
                    if (err) {
                        return console.log(err);
                      }
                    console.log("Added " + response.roleName + " to the database");

                    start();
                })
            })
    })
    .catch( err =>
        console.log(err));   
};

// define function to show all departments in the database
viewAllDepartments = () => {
    db.query(`SELECT * FROM department`, (err, res) => {
        if (err) {
            return console.log(err);
          }
        console.table(res);
        start();
    })
};

// define function to add a department to the database
addDepartment = () => {
    const addDepartmentQuestions = [
        {
            type: "input",
            message: "What is the name of the department?",
            name: "departmentName"
        },
    ]

    inquirer
        .prompt(addDepartmentQuestions)

        .then(response => {

            db.query(`INSERT INTO department (name) VALUES (?)`, (response.departmentName), (err, res) => {
                if (err) {
                    return console.log(err);
                  }
                console.log("Added " + response.departmentName + " to the database");

                start();
            })
        })
};



// call function to start application
start();