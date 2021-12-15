// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Author: Mark Drummond
// Date: 09-Dec-2021
// Project Title: CLI Organization Chart
// Assignment: employee-tracker
// See README.md for more information
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

const connection = require('./connection'); // <-- pass as parameter below when exporting

class Db {
    constructor(connection) {
        this.connection = connection; // see module.exports at the bottom of this file for the connection being passed
    }

    // ~~~~~~~~~~~~~~~~~~~~~~~~ CRUD Functions ~~~~~~~~~~~~~~~~~~~~~~~~ //

    // C: Create
    async createDepartment(data) {
        const queryString = "INSERT INTO `departments`(`name`) VALUES(?);";
        // console.log(queryString, data);
        return await this.connection.promise().query(queryString, data.name);
    }

    async createEmployee(data) {
        const queryString = "INSERT INTO `employees`(`first_name`, `last_name`, `role_id`, `manager_id`) VALUES(?,?,?,?)";
        // console.log(queryString, data);
        return await this.connection.promise().query(queryString, [data.first_name, data.last_name, data.role_id, data.manager_id]);
    }

    async createRole(data) {
        const queryString = "INSERT INTO `roles`(`title`, `salary`, `department_id`) VALUES(?,?,?);";
        // console.log(queryString, data);
        return await this.connection.promise().query(queryString, [data.title, data.salary, data.department_id]);
    }


    // R: Read
    async readDepartments(includeId = false) {
        let queryString = "SELECT ";
        queryString += includeId ? "`id`, " : '';
        queryString += "`name` ";
        queryString += (!includeId) ? "AS `All Departments:` " : '';
        queryString += "FROM `departments`;";
        // console.log(queryString);
        return await this.connection.promise().query(queryString);
    }

    async readDepartmentSalaries() {
        const queryString = "SELECT `departments`.`name` AS `Department`, CONCAT('$', " +
            "FORMAT(SUM(`roles`.`salary`), 2)) AS `Budget Utilization` " +
            "FROM `employees` " +
            "LEFT JOIN `roles` ON `employees`.`role_id` = `roles`.`id` " +
            "LEFT JOIN `departments` ON `roles`.`department_id` = `departments`.`id` " +
            "GROUP BY `departments`.`id`;";
            // console.log(queryString);
            return await this.connection.promise().query(queryString);
    }

    async readEmployees(includeId = false, where = null, includeManagerInfo = true) {
        let queryString = "SELECT ";
        queryString += includeId ? "`employees`.`id`, " : "";
        queryString += "`employees`.`first_name` AS `First Name`, `employees`.`last_name` AS `Last Name`, " +
            "`departments`.`name` AS `Department`, " +
            "`roles`.`title` AS `Role`, CONCAT('$', FORMAT(`roles`.`salary`, 2)) AS `Salary` ";
        if (includeManagerInfo) {
            queryString += ", '|' AS `|`, " +
                "CONCAT(`managers`.`first_name`, ' ', `managers`.`last_name`) AS `Manager Name`, " +
                "`manager_departments`.`name` AS `Mgr Dept.`," +
                "`manager_roles`.`title` AS `Mgr Role`, CONCAT('$', FORMAT(`manager_roles`.`salary`, 2)) AS `Mgr Salary` ";
        }
        queryString += "FROM `employees` " +
            "LEFT JOIN `roles` ON `employees`.`role_id` = `roles`.`id` " +
            "LEFT JOIN `departments` ON `roles`.`department_id` = `departments`.`id` " +
            "LEFT JOIN `employees` `managers` ON `employees`.`manager_id` = `managers`.`id` " +
            "LEFT JOIN `roles` `manager_roles` ON `managers`.`role_id` = `manager_roles`.`id` " +
            "LEFT JOIN `departments` `manager_departments` ON `manager_roles`.`department_id` = `manager_departments`.`id`";
        where ? queryString += " WHERE " + where + ";" : ";";
        // console.log(queryString);
        return await this.connection.promise().query(queryString);
    }

    async readEmployeesByDepartment(department_id) {
        const queryString = "SELECT CONCAT(`employees`.`first_name`, ' ', `employees`.`last_name`) AS `Employee`, " +
        "`roles`.`title` AS `Title` " +
        "FROM `employees` " +
        "LEFT JOIN `roles` ON `employees`.`role_id` = `roles`.`id` " +
        "LEFT JOIN `departments` ON `roles`.`department_id` = `departments`.`id` " +
        "WHERE `departments`.`id` = " + department_id + ";";
        console.log(queryString);
        return await this.connection.promise().query(queryString);
    }

    async readManagers(department_id = null) {
        let queryString = "SELECT `managers`.`id`, CONCAT(`managers`.`first_name`, ' ', `managers`.`last_name`) AS `Name`, " +
            "`departments`.`name` as `Department` " +
            "FROM `employees` AS `managers` " +
            "LEFT JOIN `roles` ON `managers`.`role_id` = `roles`.`id` " +
            "LEFT JOIN `departments` ON `roles`.`department_id` = `departments`.`id` " +
            "WHERE `managers`.`manager_id` IS NULL";
        if (department_id) {
            queryString += ", `departments`.`id`=" + department_id;
        }
        queryString += ";";
        // console.log(queryString);
        return await this.connection.promise().query(queryString);
    }

    async readRoles(includeId = false) {
        let queryString = "SELECT ";
        queryString += includeId ? "`roles`.`id` AS `RoleId`, `departments`.`id` AS `DepartmentId`, " : '';
        queryString += "`departments`.`name` AS `Department`, ";
        queryString += "`roles`.`title` AS `Title`, CONCAT('$', FORMAT(`roles`.`salary`, 2)) AS `Salary` " +
            "FROM `roles` " +
            "JOIN `departments` ON `roles`.`department_id` = `departments`.`id`;";
        // console.log(queryString);
        return await this.connection.promise().query(queryString);
    }


    // U: Update

    async updateDepartment(data) {
        const queryString = "UPDATE `departments` AS `Department` " +
            "SET `Department`.`name` = ? " +
            "WHERE `id` = ? LIMIT 1;";
        return await this.connection.promise().query(queryString, [data.name, data.id]);
    }

    async updateEmployee(data) {
        const queryString = "UPDATE `employees` AS `Employee` " +
            "SET `Employee`.`first_name` = ?, `Employee`.`last_name` = ?, `Employee`.`role_id` = ?, `Employee`.`manager_id` = ? " +
            "WHERE `id`=? LIMIT 1;";
        // console.log("updateEmployee query: ", queryString, "\nupdateEmployee data: ", data);
        return await this.connection.promise().query(queryString, [data.first_name, data.last_name, data.role_id, data.manager_id, data.employee_id]);
    }

    async updateRole(data) {
        const queryString = "UPDATE `roles` as `Role` " +
            "SET `Role`.`title` = ?, `Role`.`salary` = ?, `Role`.`department_id` = ? " +
            "WHERE `id` = ? LIMIT 1;";
        return await this.connection.promise().query(queryString, [data.title, data.salary, data.department_id, data.id]);
    }

    // D: Delete
    // Since the delete syntax for MySQL is so basic, we can have just one function and give it the table name.
    async delete(table, id) {
        const queryString = "DELETE FROM `" + table + "` WHERE `id` = ?;";
        console.log("DELETE ===============================>", queryString, "ID ================>", id);
        return await this.connection.promise().query(queryString, [id]);
    }

};

// we want to export an object of class Db, with the connection information from above
module.exports = new Db(connection);