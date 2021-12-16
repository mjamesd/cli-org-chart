# CLI Organizational Chart
![status: in development](https://img.shields.io/badge/status-version%201.0-green)

![License: GNU General Publice License v3.0](https://img.shields.io/badge/license-GNU%20General%20Publice%20License%20v3.0-yellowgreen)

## Description
A CLI content management system for a business organizational chart written in Express.js and Node.js. It utilizes asynchronous JavaScript functions and performs all CRUD functions (Create, Read, Update, and Delete) on each asset type: departments, roles, and employees. Users can also view employees by manager and by department. Users can also see the total utilized budget of all departments &mdash; in other words, the combined salaries of all employees in each department. The app uses the `Inquirer`, `MySQL2`, and `console.table` Node.js packages.

## User Story

```
AS A business owner
I WANT to be able to view and manage the departments, roles, and employees in my company
SO THAT I can organize and plan my business

GIVEN a command-line application that accepts user input
WHEN I start the application
THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
WHEN I choose to view all departments
THEN I am presented with a formatted table showing department names and department ids
WHEN I choose to view all roles
THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
WHEN I choose to view all employees
THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
WHEN I choose to add a department
THEN I am prompted to enter the name of the department and that department is added to the database
WHEN I choose to add a role
THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
WHEN I choose to add an employee
THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
WHEN I choose to update an employee
THEN I am prompted to select an employee to update and their updated info and this information is updated in the database
```

## Table of Contents
1. [Description](#description)
2. [Installation](#installation)
3. [Usage](#usage)
4. [License](#license)
5. [Questions](#questions)

## Installation

To start using the org chart, first clone the repo to your server. Then run `npm i` to install all the dependent packages.

Next, open `connection.js` in the `connection` folder. Change the MySQL user and password to your own MySQL server credentials. Next, look in the "sql" folder. In MySQL, run the SQL statements in `schema.sql`. Then, if desired, run the statements in `seed.sql` to add test data to the database. See this video: [CLI Org Chart Setup Video](https://watch.screencastify.com/v/ciBp5YTB7ZR4eBz3H3fI)

## Usage

Open a terminal, navigate to the directory containing the `index.js` file, then run `node index` to start the CLI app.

View this video to see the app's appearance and functionality: [Video demonstration of app functionality](https://watch.screencastify.com/v/pkXctBxhowrDbVn2GB3j)

## License

This work is licensed under GNU General Publice License v3.0.

## Questions

Visit [my GitHub profile](https://github.com/mjamesd)

To reach me with additional questions, send me an [email](mailto:mjamesd@gmail.com).