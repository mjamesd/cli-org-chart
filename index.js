// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Author: Mark Drummond
// Date: 09-Dec-2021
// Project Title: CLI Organization Chart
// Assignment: employee-tracker
// See README.md for more information
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// REQUIRES
const inquirer = require('inquirer');
const consoleTable = require('console.table');
const aaLogo = require('asciiart-logo');

// Import connection
const Db = require('./connection/db');

// Start the app
init();

/*

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Main App Functions ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

*/

/**
  * Function that initiates the CLI app
***/
async function init(showBanner = true) {
    let actions;
    let repeat = true;
    showBanner ? console.log(renderBanner().render()) : '';
    actions = await showOptions();
};

/**
  * Function that outputs a formatted ASCII art banner with the project title, description, and version.
***/
function renderBanner() {
    const aalTitle = "Organizational Chart";
    const aalDescription = "A CLI content management system for a business organizational chart written in Express.js and Node.js.";
    const aalVersion = "1.0.0";
    return aaLogo({
        name: aalTitle,
        // font: 'DOS Rebel',
        linechars: 10,
        padding: 2,
        margin: 3,
        kerning: 5,
        borderColor: 'grey',
        logoColor: 'bold-green',
        textColor: 'green'
    })
        .emptyLine()
        .right(`version ${aalVersion}`)
        .emptyLine()
        .center(aalDescription);
}

/**
  * Asyncronous function that collects user input and calls appropriate database function
***/
async function showOptions() {
// function showOptions() {
    // view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
    const options = [`View Departments`, `View Departments Salary Budgets`, `View Roles`, `View Employees`, `View Employees By Manager`, `View Employees By Department`, new inquirer.Separator(), `Add a Department`, `Add a Role`, `Add an Employee`, new inquirer.Separator(),`Update a Department`, `Update a Role`, `Update an Employee`, new inquirer.Separator(), `Delete Department`, `Delete Role`, `Delete Employee` , new inquirer.Separator(), `Exit`, new inquirer.Separator()];
    const response = await inquirer.prompt([
        {
            name: `action`,
            type: `list`,
            message: `Choose an option below:`,
            choices: options
        }
    ]);
    console.log(`\n\n`);
    switch (response.action) {
        case options[0]:
            await renderDepartments();
            break;
        case options[1]:
            await renderDepartmentSalaries();
            break;
        case options[2]:
            await renderRoles();
            break;
        case options[3]:
            await renderEmployees();
            break;
        case options[4]:
            await renderEmployeesByManager();
            break;
        case options[5]:
            await renderEmployeesByDepartment();
            break;
        case options[7]: // index 6 is the separator
            await addDepartment();
            break;
        case options[8]:
            await addRole();
            break;
        case options[9]:
            await addEmployee();
            break;
        case options[11]: // index 10 is the separator
            await updateDepartment();
            break;
        case options[12]:
            await updateRole();
            break;
        case options[13]:
            await updateEmployee();
            break;
        case options[15]: // index 14 is the separator
            await deleteDepartment();
            break;
        case options[16]:
            await deleteRole();
            break;
        case options[17]:
            await deleteEmployee();
            break;
        default:
            process.kill(process.pid); // Exit has been chosen -- exit the app
            break;
    };
    console.log(`\n\n`);
    const repeat = await inquirer.prompt([
        {
            name: `repeat`,
            type: `confirm`,
            message: `Continue?`
        }
    ]);
    (repeat.repeat) ? init(false) : process.kill(process.pid);
}

/*

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Rendering Functions ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

*/

async function renderDepartments(noLogo = false) {
    try {
        const [rows] = await Db.readDepartments();
        (!noLogo) ? console.log("\n", aaLogo({ name: "Departments" }).render()) : '';
        console.table(rows);
    } catch (err) {
        console.log("\n", aaLogo({ name: "Error!" }).render());
        console.error(err);
    };
};

async function renderDepartmentSalaries(noLogo = false) {
    try {
        const [rows] = await Db.readDepartmentSalaries();
        (!noLogo) ? console.log("\n", aaLogo({ name: "Departments Salaries" }).render()) : '';
        console.table(rows);
    } catch (err) {
        console.log("\n", aaLogo({ name: "Error!" }).render());
        console.error(err);
    };
}

async function renderRoles(noLogo = false) {
    try {
        const [rows] = await Db.readRoles();
        (!noLogo) ? console.log("\n", aaLogo({ name: "Roles" }).render()) : '';
        console.table(rows);
    } catch (err) {
        console.log("\n", aaLogo({ name: "Error!" }).render());
        console.error(err);
    };
};

async function renderEmployees(noLogo = false, where = null) {
    try {
        const [rows] = await Db.readEmployees(where);
        (!noLogo) ? console.log("\n", aaLogo({ name: "Employees" }).render()) : '';
        console.table(rows);
    } catch (err) {
        console.log("\n", aaLogo({ name: "Error!" }).render());
        console.error(err);
    };
};

async function renderEmployeesByManager(data = null, noLogo = false) {
    if (data) {
        const where = "`employees`.`manager_id`=" + data.id;
        try {
            const [rows] = await Db.readEmployees(false, where, false);
            (!noLogo) ? console.log("\n", aaLogo({ name: `Employees Managed by ${data.Name}` }).render()) : '';
            console.table(rows);
        } catch (err) {
            console.log("\n", aaLogo({ name: "Error!" }).render());
            console.error(err);
        };
    } else {
        const managers = await Db.readManagers();
        const manager_choices = managers[0].map((manager) =>{
            return {name: `${manager.Name} (${manager.Department})`, value: manager.id};
        });
        const response = await inquirer.prompt({
            name: 'manager_id',
            type: 'list',
            message: `Select a manager to view the employees they manage:`,
            choices: manager_choices
        });
        // Identify the employee they chose
        let manager = managers[0].filter((thisManager) => {
            return (thisManager.id == response.manager_id) ? thisManager : false;
        });
        manager = manager[0];
        renderEmployeesByManager(manager);
    }
}

async function renderEmployeesByDepartment(data = null, noLogo = false) {
    if (data) {
        const where = "`departments`.`id`=" + data.id;
        try {
            const [rows] = await Db.readEmployees(false, where, false);
            (!noLogo) ? console.log("\n", aaLogo({ name: `Employees in ${data.name} Department` }).render()) : '';
            console.table(rows);
        } catch (err) {
            console.log("\n", aaLogo({ name: "Error!" }).render());
            console.error(err);
        };
    } else {
        const departments = await Db.readDepartments(true);
        const department_choices = departments[0].map((department) =>{
            return {name: department.name, value: department.id};
        });
        const response = await inquirer.prompt({
            name: 'department_id',
            type: 'list',
            message: `Select a department to view its employees:`,
            choices: department_choices
        });
        // Identify the employee they chose
        let department = departments[0].filter((thisDepartment) => {
            return (thisDepartment.id == response.department_id) ? thisDepartment : false;
        });
        department = department[0];
        renderEmployeesByDepartment(department);
    }
}

/*

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Create Functions ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

*/

async function addDepartment(data = null) {
    if (data && data.name) {
        try {
            const [rows] = await Db.createDepartment(data);
            if (rows.warningStatus == 0) {
                console.log("\n", aaLogo({ name: `New Department ${data.name} Added!` }).render());
            }
            renderDepartments(true);
        } catch (err) {
            console.log("\n", aaLogo({ name: "Error!" }).render());
            console.error(err);
        }
    } else {
        const department = await inquirer.prompt([
            {
                name: 'name',
                type: 'input',
                message: `Enter the new Department's name:`
            },
            {
                name: 'confirmadd',
                type: 'confirm',
                message: `Confirm add department:`
            }
        ]);
        if (department.confirmadd) {
            addDepartment(department); // call itself but this time with data
        } else {
            return;
        }
    }
}

async function addEmployee(data = null) {
    if (data) {
        try {
            const [rows] = await Db.createEmployee(data);
            if (rows.warningStatus == 0) {
                console.log("\n", aaLogo({ name: `New Employee ${data.first_name} ${data.last_name} Added!` }).render());
            }
            renderEmployees(true);
        } catch (err) {
            console.log("\n", aaLogo({ name: "Error!" }).render());
            console.error(err);
        }
    } else {
        const roles = await Db.readRoles(true); // Db.readRoles(includeId = true)
        const role_choices = roles[0].map((role) =>({ name: `${role.Title} (${role.Department})`, value: role.RoleId }));
        const managers = await Db.readManagers();
        let manager_choices = managers[0].map((manager) =>({ name: `${manager.Name} (${manager.Department})`, value: manager.id }));
        manager_choices.push({ name: `(None)`, value: null });
        const employee = await inquirer.prompt([
            {
                name: 'first_name',
                type: 'input',
                message: `Enter the new Employee's first name:`
            },
            {
                name: 'last_name',
                type: 'input',
                message: `Enter the new Employee's last name:`
            },
            {
                name: 'role_id',
                type: 'list',
                message: `Select the new Employee's role:`,
                choices: role_choices
            },
            {
                name: 'manager_id',
                type: 'list',
                message: `Select the new Employee's manager:`,
                choices: manager_choices
            }
        ]);
        addEmployee(employee); // call itself but this time with data
    }
}

async function addRole(data = null) {
    if (data) {
        try {
            const [rows] = await Db.createRole(data);
            if (rows.warningStatus == 0) {
                console.log("\n", aaLogo({ name: `New Role ${data.title} Added!` }).render());
            }
            renderRoles(true);
        } catch (err) {
            console.log("\n", aaLogo({ name: "Error!" }).render());
            console.error(err);
        }
    } else {
        const departments = await Db.readDepartments(true); // Db.readDepartments(includeId = true)
        const dept_choices = departments[0].map((dept) =>({ name: dept.name, value: dept.id }));
        const role = await inquirer.prompt([
            {
                name: 'title',
                type: 'input',
                message: `Enter the new Role's title:`
            },
            {
                name: 'salary',
                type: 'input',
                message: `Enter the salary:`
            },
            {
                name: 'department_id',
                type: 'list',
                message: `Enter the department:`,
                choices: dept_choices
            },
            {
                name: 'confirmadd',
                type: 'confirm',
                message: `Confirm add role:`
            }
        ]);
        if (role.confirmadd) {
            addRole(role); // call itself but this time with data
        } else {
            return;
        }
    }
}

/*

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Update Functions ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

*/

async function updateDepartment(data = null) {
    if (data) {
        try {
            const [rows] = await Db.updateDepartment(data);
            if (rows.warningStatus == 0) {
                console.log("\n", aaLogo({ name: `${data.name} Department Updated!` }).render());
            }
            renderDepartments(true);
        } catch (err) {
            console.log("\n", aaLogo({ name: "Error!" }).render());
            console.error(err);
        }
    } else {
        const departments = await Db.readDepartments(true);
        const department_choices = departments[0].map((department) => ({ name: department.name, value: department.id }));
        const response = await inquirer.prompt([
            {
                name: `department_id`,
                type: `list`,
                message: `Select the department you would like to update:`,
                choices: department_choices
            }
        ]);
        // Identify the department they chose
        let thisDepartment = departments[0].filter((department) => (department.id == response.department_id) ? department : false);
        thisDepartment = thisDepartment[0];
        const department_update = await inquirer.prompt([
            {
                name: `name`,
                type: `input`,
                message: `Edit the department's name: (Blank to keep the same)`
            }
        ]);
        const department = {
            id: response.department_id,
            name: department_update.name ? department_update.name : thisDepartment.name
        };
        updateDepartment(department);
    }
}

async function updateEmployee(data = null) {
    if (data) {
        try {
            const [rows] = await Db.updateEmployee(data);
            if (rows.warningStatus == 0) {
                console.log("\n", aaLogo({ name: `Employee ${data.first_name} ${data.last_name} Updated!` }).render());
            }
            renderEmployees(true);
        } catch (err) {
            console.log("\n", aaLogo({ name: "Error!" }).render());
            console.error(err);
        }
    } else {
        const employees = await Db.readEmployees(true);
        const employee_choices = employees[0].map((employee) => ({ name: `${employee["First Name"]} ${employee["Last Name"]} (${employee.Role, employee.Department})`, value: employee.id }));
        const roles = await Db.readRoles(true); // Db.readRoles(includeId = true)
        const role_choices = roles[0].map((role) =>({ name: `${role.Title} (${role.Department})`, value: role.RoleId }));
        const managers = await Db.readManagers();
        let manager_choices = managers[0].map((manager) =>({ name: `${manager.Name} (${manager.Department})`, value: manager.id }));
        manager_choices.push({name: `(None)`, value: null});
        // Ask for employee info
        const employee_current = await inquirer.prompt([
            {
                name: `employee_id`,
                type: `list`,
                message: `Select the employee you would like to update:`,
                choices: employee_choices
            }
        ]);
        // Identify the employee they chose
        let thisEmployee = employees[0].filter((employee) => (employee.id == employee_current.employee_id) ? employee : false);
        thisEmployee = thisEmployee[0];
        const employee_update = await inquirer.prompt([
            {
                name: `first_name`,
                type: `input`,
                message: `Edit the employee's first name: (Blank to keep the same)`
            },
            {
                name: `last_name`,
                type: `input`,
                message: `Edit the employee's last name: (Blank to keep the same)`
            },
            {
                name: `role_id`,
                type: `list`,
                message: `Select the new role for the employee:`,
                choices: role_choices
            },
            {
                name: `manager_id`,
                type: `list`,
                message: `Select the new manager for the employee:`,
                choices: manager_choices
            }
        ]);
        // Put together the two inquirer responses
        const employee = {
            employee_id: employee_current.employee_id,
            first_name: (employee_update.first_name) ? employee_update.first_name : thisEmployee["First Name"],
            last_name: (employee_update.last_name) ? employee_update.last_name : thisEmployee["Last Name"],
            role_id: employee_update.role_id ? employee_update.role_id : thisEmployee.role_id,
            manager_id: employee_update.manager_id ? employee_update.manager_id : thisEmployee.manager_id
        };
        updateEmployee(employee);
    }
}

async function updateRole(data = null) {
    if (data) {
        try {
            const [rows] = await Db.updateRole(data);
            if (rows.warningStatus == 0) {
                console.log("\n", aaLogo({ name: `${data.title} Role Updated!` }).render());
            }
            renderRoles(true);
        } catch (err) {
            console.log("\n", aaLogo({ name: "Error!" }).render());
            console.error(err);
        }
    } else {
        const roles = await Db.readRoles(true);
        let role_choices = roles[0].map((role) => ({ name: role.Title, value: role.RoleId }));
        const response = await inquirer.prompt([
            {
                name: `role_id`,
                type: `list`,
                message: `Select the role you would like to update:`,
                choices: role_choices
            }
        ]);
        const departments = await Db.readDepartments(true);
        const department_choices = departments[0].map((department) => ({ name: department.name, value: department.id }));
        // Identify the role they chose
        let thisRole = roles[0].filter((role) => (role.RoleId == response.role_id) ? role : false);
        thisRole = thisRole[0];
        const role_update = await inquirer.prompt([
            {
                name: `title`,
                type: `input`,
                message: `Edit the role's title: (Blank to keep the same)`
            },
            {
                name: `salary`,
                type: `input`,
                message: `Edit the role's salary: (Blank to keep the same)`
            },
            {
                name: `department_id`,
                type: `list`,
                message: `Change the role's department:`,
                choices: department_choices
            }
        ]);
        const role = {
            id: response.role_id,
            title: role_update.title ? role_update.title : thisRole.Title,
            salary: role_update.salary ? role_update.salary : thisRole.Salary,
            department_id: role_update.department_id ? role_update.department_id : thisRole.department_id
        };
        updateRole(role);
    }
}

/*

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Delete Functions ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

*/

async function deleteDepartment(data) {
    if (data) {
        try {
            const [rows] = await Db.delete('departments', data.id);
            if (rows.warningStatus == 0) {
                console.log("\n", aaLogo({ name: `Department ${data.name} Deleted!` }).render());
            }
            renderDepartments(true);
        } catch (err) {
            console.log("\n", aaLogo({ name: "Error!" }).render());
            console.error(err);
        }
    } else {
        const departments = await Db.readDepartments(true);
        let department_choices = departments[0].map((department) =>({ name: department.name, value: department.id }));
        department_choices.push({ name: `Go back`, value: `exit` });
        const department_id = await inquirer.prompt([
            {
                name: `id`,
                type: `list`,
                message: `Select the department to delete:`,
                choices: department_choices
            }
        ]);
        if (department_id.id == `exit`) {
            return;
        }
        const thisDepartment = departments[0].filter((department) => (department.id == department_id.id) ? department : false);
        const department = thisDepartment[0];
        deleteDepartment(department);
    }
}

async function deleteEmployee(data) {
    if (data) {
        try {
            const [rows] = await Db.delete('employees', data.id);
            if (rows.warningStatus == 0) {
                console.log("\n", aaLogo({ name: `Employee ${data["First Name"]} ${data["Last Name"]} Deleted!` }).render());
            }
            renderEmployees(true);
        } catch (err) {
            console.log("\n", aaLogo({ name: "Error!" }).render());
            console.error(err);
        }
    } else {
        const employees = await Db.readEmployees(true);
        let employee_choices = employees[0].map((employee) =>({ name: `${employee["First Name"]} ${employee["Last Name"]}`, value: employee.id }));
        employee_choices.push({ name: `Go back`, value: `exit` });
        const employee_id = await inquirer.prompt([
            {
                name: `id`,
                type: `list`,
                message: `Select the employee to delete:`,
                choices: employee_choices
            }
        ]);
        if (employee_id.id == `exit`) {
            return;
        }
        const thisEmployee = employees[0].filter((employee) => {
            return (employee.id == employee_id.id) ? employee : false;
        });
        const employee = thisEmployee[0];
        deleteEmployee(employee);
    }
}

async function deleteRole(data) {
    if (data) {
        try {
            const [rows] = await Db.delete('roles', data.RoleId);
            if (rows.warningStatus == 0) {
                console.log("\n", aaLogo({ name: `Role ${data.Title} Deleted!` }).render());
            }
            renderRoles(true);
        } catch (err) {
            console.log("\n", aaLogo({ name: "Error!" }).render());
            console.error(err);
        }
    } else {
        const roles = await Db.readRoles(true);
        let role_choices = roles[0].map((role) =>({ name: `${role.Title} (${role.Department})`, value: role.RoleId }));
        role_choices.push({ name: `Go back`, value: `exit` });
        const role_id = await inquirer.prompt([
            {
                name: `id`,
                type: `list`,
                message: `Select the role to delete:`,
                choices: role_choices
            }
        ]);
        if (role_id.id == `exit`) {
            return;
        }
        const thisRole = roles[0].filter((role) => {
            return (role.RoleId == role_id.id) ? role : false;
        });
        const role = thisRole[0];
        deleteRole(role);
    }
}

// eof