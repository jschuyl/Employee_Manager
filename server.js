const mysql = require('mysql2');
const inquirer = require('inquirer');
const ctable = require('console.table'); // "C" table... get it?

require('dotenv').config()

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'workplace_db'
  }
)

db.connect(function(err) {
  if (err) {
   console.error('error connecting: ' + err.stack);
   return;
  }
  console.log('connected as id ' + db.threadId);
  welcome();
  questions();
});

function welcome(){
console.log('____________________'),
console.log('|                  |'),
console.log('|    WELCOME TO    |'),
console.log('| EMPLOYEE MANAGER |'),
console.log('|                  |'),
console.log('‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾')
};
// Ask the questions to know what the user wants

const questions = () => {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do?",
        name: "bigChoice",
        choices: [ 
        "View all departments", 
        "View all roles", 
        "View all employees", 
        "Add a department", 
        "Add a role", 
        "Add an employee",  
        "Update an employee role"
      ]}
    ])
    .then(answers => {
      const choice = answers;

      if (choice === "View all departments") {
        viewDepartments();
      } if (choice === "View all roles") {
        viewRoles();
      } if (choice === "View all employees") {
        viewEmployees();
      } if (choice === "Add a department") {
        addDepartment()
      } if (choice === "Add a role") {
        addRole();
      } if (choice === "Add an employee") {
        addEmployee();
      } if (choice === "Update an employee role") {
        updateEmployee();
      }
    })
}
function viewDepartments(){

  const tellMe = "SELECT * FROM department;";

  db.query(tellMe, (err, rows) => {
    if (err) {
      throw
    } else {
      console.table(rows);
      questions();
    }
  })
}
function viewRoles(){
  
  const tellMe = "SELECT * FROM role;"

  db.query(tellMe, (err, rows) => {
    if (err) {
      throw
    } else {
      console.table(rows);
      questions();
    }
  })
}
function viewEmployees(){

  const tellMeById = "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary FROM employee LEFT JOIN role ON role.id=employee.id LEFT JOIN department ON department.id=role.id;";
  const tellMeByLastName = "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary FROM employee LEFT JOIN role ON role.id=employee.id LEFT JOIN department ON department.id=role.id ORDER BY last_name ASC;";
  const tellMeByFirstName = "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary FROM employee LEFT JOIN role ON role.id=employee.id LEFT JOIN department ON department.id=role.id ORDER BY first_name ASC;"
  // Narrow by user known information
  inquirer
    .prompt([
      {
        type: "list",
        message: "Ordered by:",
        choices: [
          "ID",
          "First Name",
          "Last Name"
        ]
      }
    ])
    .then(answers => {
      const choice = answers;
      if (choice === "ID") {
        db.query(tellMeById, (err, rows) => {
          if (err){
            throw err;
          } else {
            console.table(rows),
            questions();
          }
        })
      } if (choice === "First Name") {
        db.query(tellMeByFirstName, (err, rows) => {
          if (err){
            throw err;
          } else {
            console.table(rows),
            questions();
          }
        })
      } if (choice === "Last Name") {
        db.query(tellMeByLastName, (err, rows) => {
          if (err){
            throw err;
          } else {
            console.table(rows),
            questions();
          }
        })
      }
    })
}
function addDepartment(){

}
function addRole(){

}
function addEmployee(){

}
function updateEmployee(){
  
}