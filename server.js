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

}
function viewRoles(){

}
function viewEmployees(){

}
function addDepartment(){

}
function addRole(){

}
function addEmployee(){

}
function updateEmployee(){
  
}