const mysql = require('mysql2');
const inquirer = require('inquirer');
const ctable = require('console.table'); // `C` table... get it?
const { response } = require('express');

require('dotenv').config()

const connection = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'workplace_db'
  }
)

connection.connect(function(err) {
  if (err) {
   console.error('error connecting: ' + err.stack);
   return;
  }
  console.log('connected as id ' + connection.threadId);
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
        type: `list`,
        message: `What would you like to do?`,
        name: `bigChoice`,
        choices: [ 
        'View all departments', 
        'View all roles', 
        'View all employees', 
        'Add a department', 
        'Add a role', 
        'Add an employee',  
        'Update an employee',
        'Quit'
      ]}
    ])
    .then((response) => {
      switch (response.bigChoice) {
        case 'View all departments':
          viewDepartments();
          break;
        case 'View all roles':
          viewRoles();
          break;
        case 'View all employees':
          viewEmployees();
          break;
        case 'Add a department':
          addDepartment();
          break;
        case 'Add a role':
          addRole();
          break;
        case 'Add an employee':
          addEmployee();
          break;
        case 'Update an employee':
          updateEmployee();
          break;
        case 'Quit':
          console.log('Thank you for using Employee Manager');
          connection.end();
          console.log('Shutdown complete');
          break;
      }

    })
}

function viewDepartments(){

  const tellMe = `SELECT * FROM department;`;

  connection.query(tellMe, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    questions();
  })
}

function viewRoles(){

  const tellMe = `SELECT role.id, department.name, role.title, role.salary FROM role LEFT JOIN department ON department.id=role.department_id;`

  connection.query(tellMe, (err, rows) => {
    if (err) throw err
      console.table(rows);
      questions();
    })
}

function viewEmployees(){

  const tellMeById = `SELECT employee.id, employee.first_name, employee.last_name, department.name, role.title, role.salary FROM employee LEFT JOIN role ON role.id=employee.role_id LEFT JOIN department ON department.id=role.department_id;`;
  const tellMeByLastName = `SELECT employee.id, employee.last_name, employee.first_name, department.name, role.title, role.salary FROM employee LEFT JOIN role ON role.id=employee.role_id LEFT JOIN department ON department.id=role.department_id ORDER BY last_name ASC;`;
  const tellMeByFirstName = `SELECT employee.id, employee.first_name, employee.last_name, department.name, role.title, role.salary FROM employee LEFT JOIN role ON role.id=employee.role_id LEFT JOIN department ON department.id=role.department_id ORDER BY first_name ASC;`
  // Narrow by user known information
  inquirer
    .prompt([
      {
        type: `list`,
        message: `Ordered by:`,
        name: 'smallChoice',
        choices: [
          `ID`,
          `First Name`,
          `Last Name`,
          `Back`
        ]
      }
    ])
    .then((response) => {
      switch (response.smallChoice) {
        case 'ID':
          connection.query(tellMeById, (err, rows) => {
            if (err) throw err;
              console.table(rows);
              viewEmployees();
          });
          break;
        case 'First Name':
          connection.query(tellMeByFirstName, (err, rows) => {
            if (err) throw err;
              console.table(rows);
              viewEmployees();
          });
          break;
        case 'Last Name':
          connection.query(tellMeByLastName, (err, rows) => {
            if (err) throw err;
              console.table(rows);
              viewEmployees();
          })
          break;
        case 'Back':
          questions();
          break;
      }
    })
}

function addDepartment(){
  inquirer
    .prompt([
      {
        type: `input`,
        name: `newDepartment`,
        message: `What is the name of the new department?`
      }
    ])
    .then((response) => {
      connection.query(`INSERT INTO department (name) VALUES ('${response.newDepartment}')`, (err, result) => {
        if (err) throw err;
        viewDepartments();
      })
    })

}

function addEmployee(){
  let chooseDepartments = [];
  let chooseRoles = [];
  let chooseManagers = [];

  // GET DEPARTMENT NAMES
connection.query('SELECT * FROM department', (err, depInfo) => {
  if (err) throw err;
   chooseDepartments = depInfo.map(({ id, name })=> ({ name: name, value: id })); 


  inquirer.prompt([
    {
      type: `list`,
      message: `Which department will the new employee work in?`,
      name: `department`,
      choices: chooseDepartments
    },
  ])
  .then((response) => {
    // GET ROLE NAMES
    connection.query(`SELECT role.id, role.title FROM role WHERE department_id=${response.department}`, (err, roleInfo) => {
      if (err) throw err;
      chooseRoles = roleInfo.map(({ id, title}) => ({name: title, value: id}));
    // GET MANAGER NAMES
    connection.query(`SELECT employee.id, employee.first_name, employee.last_name FROM employee WHERE role_id=1`, (err, managerInfo) => {
      if (err) throw err;
      chooseManagers = managerInfo.map(({ id, first_name, last_name}) => ({name: `${first_name} ${last_name}`, value: id }));

      inquirer
      .prompt([
        {
          type: `input`,
          message: `What is the new employee's first name?`,
          name: `first`
        },
        {
          type: `input`,
          message: `What is the new employee's last name?`,
          name: `last`
        },
        {
          type: `list`,
          message: `What is their job title?`,
          name: `title`,
          choices: chooseRoles
        },
        {
          type: `list`,
          message: `Who will manage this employee`,
          name: 'micro',
          choices: chooseManagers
        }
      ])
      .then((response) => {
        connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${response.first}', '${response.last}', '${response.title}', '${response.micro}')`, (err) => {
          console.log('Employee added')
          if (err) throw err;
          questions();
            })
          })
        })
      })
    })
  })
};

function addRole(){
  inquirer
    .prompt([
      {
        type: `input`,
        message: `Which department will this new role be in?`,
        name: `department`,
        choices: [
          // see if you can populate the department names from department table mySQL as choices
        ]        
      },
      {
        type: `input`,
        message: `What is the title of this new role?`,
        name: `title`
      },
      {
        type: `input`,
        message: `What is the yearly salary of this new role?`,
        name: `dollaDollaBills`
      }

    ])

}

function updateEmployee(){
  
  inquirer
    .prompt([
      {
        type: `input`,
        message: `Please choose the employee you wish to update by their ID:`,
        name: `Id`
      }
    ])
      .then((response) => {
        const selectEmployee = `SELECT employee.id, employee.first_name, employee.last_name, department.name, role.title, role.salary FROM employee LEFT JOIN role ON role.id=employee.role_id LEFT JOIN department ON department.id=role.department_id WHERE employee.id=${response.Id};`

        connection.query(selectEmployee, (err, rows) =>{
          if (err) throw err;
          console.table(rows)
        })
      })
    /*
      {
        type: `list`,
        message: `What would you like to update for this employee?`, // might be zesty to get the employee's name in there?
        choices: [
          `Update first name`,
          `Update last name`,
          `Update role`,
          `Terminate` // hoping this isn't over acheiving
        ],
        name: `inMyHands`
      }*/
    
  
  }