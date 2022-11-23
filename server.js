const inquirer = require('inquirer');
const ctable = require('console.table'); // `C` table... get it?

const connection = require('./config/connection')

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
console.log('________________________'),
console.log('|||                  |||'),
console.log('|||    WELCOME TO    |||'),
console.log('||| EMPLOYEE MANAGER |||'),
console.log('|||                  |||'),
console.log('‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾')
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

function viewDepartments(){ // FINISHED

  const tellMe = `SELECT * FROM department;`;

  connection.query(tellMe, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    questions();
  })
}

function viewRoles(){ // FINISHED

  const tellMe = `SELECT role.id, department.name, role.title, role.salary FROM role LEFT JOIN department ON department.id=role.department_id;`

  connection.query(tellMe, (err, rows) => {
    if (err) throw err
      console.table(rows);
      questions();
    })
}

function viewEmployees(){ // FINISHED

  const tellMeById = `SELECT employee.id, employee.first_name, employee.last_name, department.name AS department_name, role.title, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name FROM employee LEFT JOIN role ON role.id=employee.role_id LEFT JOIN department ON department.id=role.department_id LEFT JOIN employee manager ON employee.manager_id=manager.id;`;
  const tellMeByLastName = `SELECT employee.id, employee.last_name, employee.first_name, department.name AS department_name, role.title, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name FROM employee LEFT JOIN role ON role.id=employee.role_id LEFT JOIN department ON department.id=role.department_id  LEFT JOIN employee manager ON employee.manager_id=manager.id ORDER BY last_name ASC;`;
  const tellMeByFirstName = `SELECT employee.id, employee.first_name, employee.last_name, department.name AS department_name, role.title, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name FROM employee LEFT JOIN role ON role.id=employee.role_id LEFT JOIN department ON department.id=role.department_id LEFT JOIN employee manager ON employee.manager_id=manager.id ORDER BY first_name ASC;`
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

function addDepartment(){ // FINISHED
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

function addEmployee(){ // FINISHED
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

function addRole(){ // NEEDS TESTING
  let chooseDepartments = [];

  connection.query('SELECT * FROM department', (err, depInfo) => {
    if (err) throw err;
     chooseDepartments = depInfo.map(({ id, name })=> ({ name: name, value: id })); 
  
  
    inquirer.prompt([
      {
        type: `list`,
        message: `Which department will this new role be in?`,
        name: `department`,
        choices: chooseDepartments
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
    .then((response) => {
      connection.query(`INSERT INTO roles (title, salary, department_id) VALUES (${response.title}, ${response.dollaDollaBills}, ${response.department})`, (err) => {
        if (err) throw err;
        console.log(`${response.title} role added to ${response.department}`);
        questions();
      })
    })

})}

function updateEmployee(){ // NEEDS WORK
  let thisHereEmployee = [];
  let thisHereEmployeeId = '';

  inquirer
    .prompt([
      {
        type: `input`,
        message: `Please choose the employee you wish to update by their ID:`,
        name: `Id`
      }
    ])
      .then((response) => {
        
        const selectEmployee = `SELECT employee.id, employee.first_name, employee.last_name, department.name, role.title, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name FROM employee LEFT JOIN role ON role.id=employee.role_id LEFT JOIN department ON department.id=role.department_id LEFT JOIN employee manager ON employee.manager_id=manager.id WHERE employee.id=${response.Id};`

        thisHereEmployeeId = response.Id;

        connection.query(selectEmployee, (err, empInfo) =>{
          if (err) throw err;
          thisHereEmployee = empInfo.map(({ id, first_name, last_name, title, manager_name}) => ({ name: `${first_name} ${last_name}`, value: id},
          console.log(`${first_name} ${last_name} works as a ${title} under ${manager_name}`)));
          

          inquirer
          .prompt([
            {
              type: `list`,
              message: `What would you like to update for ${thisHereEmployee.name}?`,
              choices: [
                `Update first name`,
                `Update last name`,
                `Update role`,
                `Terminate` // hoping this isn't over acheiving
              ],
              name: `inMyHands`
            }
          ])
          .then((response) => {
            switch (response.inMyHands) {
              case 'Update first name':
                inquirer
                  .prompt([
                    {
                      type: 'input',
                      message: 'What would you like to change their first name to?',
                      name: 'newFirstName'
                    }
                  ])
                  .then((response) => {
                    connection.query(`UPDATE employee SET first_name='${response.newFirstName}' WHERE employee.id=${thisHereEmployeeId}`, (err, result) => {
                      if (err) throw err;
                      console.log(`Employee #${thisHereEmployeeId} had their first name successfully changed to ${response.newFirstName}`);
                      questions();
                    })})
                    break;
                case 'Update last name':
                  inquirer
                  .prompt([
                    {
                      type: 'input',
                      message: 'What would you like to change their last name to?',
                      name: 'newLastName'
                    }
                  ])
                  .then((response) => {
                    connection.query(`UPDATE employee SET last_name='${response.newLastName}' WHERE employee.id=${thisHereEmployeeId}`, (err, result) => {
                      if (err) throw err;
                      console.log(`Employee #${thisHereEmployeeId} had their Last name successfully changed to ${response.newLastName}`);
                      questions();
                    })})
                    break; 
                case 'Update role':
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
                        message: `Which department will this employee now work in?`,
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
                            type: `list`,
                            message: `What is their new role title?`,
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
                          connection.query(`UPDATE employee SET role_id=${response.title}, manager_id=${response.micro} WHERE employee.id=${thisHereEmployeeId}`, (err) => {
                            console.log(`Employee updated`)
                            if (err) throw err;
                            questions();

                              })
                            })
                          })
                        })
                      })
                    }) 
                    break;
                  case 'Terminate':
                     inquirer
                     .prompt([
                      {
                        type: 'confirm',
                        message: 'This action is irreversible, are you sure you wish to continue?',
                        name: 'emperorsThumb'
                      }
                     ])
                     .then((response) => {
                        if (response.emperorsThumb === true ){
                          connection.query(`DELETE FROM employee WHERE employee.id=${thisHereEmployeeId}`, (err) => {
                            console.log(`Employee #${thisHereEmployeeId} terminated, returning to menu`);
                            questions();
                          })
                        } if (response.emperorsThumb === false) {
                          console.log('Termination aborted, returning to menu');
                          questions();
                        }
                     })
                     break;              
                  }
                })
              })})}