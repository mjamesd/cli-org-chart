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
const { updateDepartment, updateRole } = require('./connection/db');

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
    if (data) {
        try {
            const [rows] = await Db.createDepartment(data);
            if (rows.warningStatus == 0) {
                console.log("\n", aaLogo({ name: `New Department "${data.name}" Added!` }).render());
                console.log(`\nNew Department ${data.name} successfully added.\n\n`);
            }
            renderDepartments(true);
        } catch (err) {
            console.log("\n", aaLogo({ name: "Error!" }).render());
            console.error(err);
        }
    } else {
        const department = await inquirer.prompt({
            name: 'name',
            type: 'input',
            message: `Enter the new Department's name:`
        });
        addDepartment(department); // call itself but this time with data
    }
}

async function addEmployee(data = null) {
    if (data) {
        try {
            const [rows] = await Db.createEmployee(data);
            if (rows.warningStatus == 0) {
                console.log("\n", aaLogo({ name: `New Employee "${data.first_name} ${data.last_name}" Added!` }).render());
                console.log(`\nNew Employee ${data.name} successfully added.\n\n`);
            }
            renderEmployees(true);
        } catch (err) {
            console.log("\n", aaLogo({ name: "Error!" }).render());
            console.error(err);
        }
    } else {
        const roles = await Db.readRoles(true); // Db.readRoles(includeId = true)
        const role_choices = roles[0].map((role) =>{
            return {name: `${role.Title} (${role.Department})`, value: role.RoleId};
        });
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
            }
        ]);
        // const managers = await Db.readManagers(employee.department_id); // Db.readManagers(department_id = #)
        const managers = await Db.readManagers();
        const manager_choices = managers[0].map((manager) =>{
            return {name: `${manager.Name} (${manager.Department})`, value: manager.id};
        });
        const employee_manager = await inquirer.prompt({
            name: 'manager_id',
            type: 'list',
            message: `Select the new Employee's manager:`,
            choices: manager_choices
        });
        employee.manager_id = employee_manager.manager_id;
        addEmployee(employee); // call itself but this time with data
    }
}

async function addRole(data = null) {
    if (data) {
        try {
            const [rows] = await Db.createRole(data);
            if (rows.warningStatus == 0) {
                console.log("\n", aaLogo({ name: `New Role "${data.title}" Added!` }).render());
                console.log(`\nNew Role ${data.title} successfully added.`);
            }
            renderRoles(true);
            showOptions();
        } catch (err) {
            console.log("\n", aaLogo({ name: "Error!" }).render());
            console.error(err);
        }
    } else {
        const departments = await Db.readDepartments(true); // Db.readDepartments(includeId = true)
        const dept_choices = departments[0].map((dept) =>{
            return {name: dept.name, value: dept.id};
        });
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
            }
        ]);
        addRole(role); // call itself but this time with data
    }
}

/*

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Update Functions ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

*/

async function updateEmployee(data = null) {
    if (data) {
        try {
            const [rows] = await Db.updateEmployee(data);
            if (rows.warningStatus == 0) {
                console.log("\n", aaLogo({ name: `Employee "${data.first_name} ${data.last_name}" Updated!` }).render());
                console.log(`\Employee ${data.first_name} ${data.last_name} successfully updated.\n\n`);
            }
            renderEmployees(true);
        } catch (err) {
            console.log("\n", aaLogo({ name: "Error!" }).render());
            console.error(err);
        }
    } else {
        const employees = await Db.readEmployees(true);
        const employee_choices = employees[0].map((employee) => {
            return { name: `${employee["First Name"]} ${employee["Last Name"]} (${employee.Role, employee.Department})`, value: employee.id };
        });
        const roles = await Db.readRoles(true); // Db.readRoles(includeId = true)
        const role_choices = roles[0].map((role) =>{
            return {name: `${role.Title} (${role.Department})`, value: role.RoleId};
        });
        const managers = await Db.readManagers();
        let manager_choices = managers[0].map((manager) =>{
            return {name: `${manager.Name} (${manager.Department})`, value: manager.id};
        });
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
        const thisEmployee = employees[0].filter((employee) => {
            return (employee.id == employee_current.employee_id) ? employee : false;
        });
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
            first_name: (employee_update.first_name !== '') ? employee_update.first_name : thisEmployee[0]["First Name"],
            last_name: (employee_update.last_name !== '') ? employee_update.last_name : thisEmployee[0]["Last Name"],
            role_id: employee_update.role_id,
            manager_id: employee_update.manager_id
        };
        updateEmployee(employee);
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
                console.log(`\Department ${data.name} successfully deleted.\n\n`);
            }
            renderDepartments(true);
        } catch (err) {
            console.log("\n", aaLogo({ name: "Error!" }).render());
            console.error(err);
        }
    } else {
        const departments = await Db.readDepartments(true);
        const department_choices = departments[0].map((department) =>{
            return {name: department.name, value: department.id};
        });
        const department_id = await inquirer.prompt([
            {
                name: `id`,
                type: `list`,
                message: `Select the department to delete:`,
                choices: department_choices
            }
        ]);
        const thisDepartment = departments[0].filter((department) => {
            return (department.id == department_id.id) ? department : false;
        });
        const department = thisDepartment[0];
        deleteDepartment(department);
    }
}

async function deleteRole(data) {
    if (data) {
        try {
            const [rows] = await Db.delete('roles', data.RoleId);
            if (rows.warningStatus == 0) {
                console.log("\n", aaLogo({ name: `Role ${data.Title} Deleted!` }).render());
                console.log(`\Department ${data.Title} successfully deleted.\n\n`);
            }
            renderRoles(true);
        } catch (err) {
            console.log("\n", aaLogo({ name: "Error!" }).render());
            console.error(err);
        }
    } else {
        const roles = await Db.readRoles(true);
        const role_choices = roles[0].map((role) =>{
            return {name: `${role.Title} (${role.Department})`, value: role.RoleId};
        });
        const role_id = await inquirer.prompt([
            {
                name: `id`,
                type: `list`,
                message: `Select the role to delete:`,
                choices: role_choices
            }
        ]);
        const thisRole = roles[0].filter((role) => {
            return (role.RoleId == role_id.id) ? role : false;
        });
        const role = thisRole[0];
        deleteRole(role);
    }
}

async function deleteEmployee(data) {
    if (data) {
        try {
            const [rows] = await Db.delete('employees', data.id);
            if (rows.warningStatus == 0) {
                console.log("\n", aaLogo({ name: `Employee ${data["First Name"]} ${data["Last Name"]} Deleted!` }).render());
                console.log(`\Department ${data["First Name"]} ${data["Last Name"]} successfully deleted.\n\n`);
            }
            renderEmployees(true);
        } catch (err) {
            console.log("\n", aaLogo({ name: "Error!" }).render());
            console.error(err);
        }
    } else {
        const employees = await Db.readEmployees(true);
        const employee_choices = employees[0].map((employee) =>{
            return {name: `${employee["First Name"]} ${employee["Last Name"]}`, value: employee.id};
        });
        const employee_id = await inquirer.prompt([
            {
                name: `id`,
                type: `list`,
                message: `Select the employee to delete:`,
                choices: employee_choices
            }
        ]);
        const thisEmployee = employees[0].filter((employee) => {
            return (employee.id == employee_id.id) ? employee : false;
        });
        const employee = thisEmployee[0];
        deleteEmployee(employee);
    }
}




// eof