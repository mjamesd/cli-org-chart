-- DEPARTMENTS --
DROP TABLE IF EXISTS `org_chart_db`.`departments`;

CREATE TABLE `org_chart_db`.`departments`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(30) NOT NULL,
    PRIMARY KEY (`id`)
);

INSERT INTO `org_chart_db`.`departments`(`name`) VALUES
    ("Accounting"),
    ("Engineering"),
    ("Human Resources"),
    ("Marketing");


-- ROLES --
DROP TABLE IF EXISTS `org_chart_db`.`roles`;

CREATE TABLE `org_chart_db`.`roles`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `department_id` INT NULL,
    `title` VARCHAR(30) NOT NULL,
    `salary` DECIMAL DEFAULT 0.0,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`department_id`) REFERENCES `org_chart_db`.`departments` (`id`) ON DELETE SET NULL
);

INSERT INTO `org_chart_db`.`roles`(`department_id`,`title`,`salary`) VALUES
    (1,"Account Manager",200000.00),
    (1,"Accountant",150000.00),
    (2,"Engineering Manager",180000.00),
    (2,"Software Developer",130000.00),
    (3,"HR Manager",160000.00),
    (3,"Benefits Officer",110000.00),
    (4,"Sales Manager",140000.00),
    (4,"Salesperson",90000.00);


-- EMPLOYEES --
DROP TABLE IF EXISTS `org_chart_db`.`employees`;

CREATE TABLE `org_chart_db`.`employees`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `role_id` INT DEFAULT NULL,
    `manager_id` INT DEFAULT NULL,
    `first_name` VARCHAR(30) NOT NULL,
    `last_name` VARCHAR(30) NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`role_id`) REFERENCES `org_chart_db`.`roles` (`id`) ON DELETE SET NULL,
    FOREIGN KEY (`manager_id`) REFERENCES `org_chart_db`.`employees` (`id`) ON DELETE SET NULL
);

INSERT INTO `org_chart_db`.`employees`(`role_id`, `manager_id`, `first_name`, `last_name`) VALUES
    (1,null,"Amy","Borcha"),
    (2,1,"Charlie","Dodrick"),
    (2,1,"Emily","Freage"),
    (3,null,"Greg","Hendrickson"),
    (4,4,"Igor","Journik"),
    (4,4,"Kim","Laalo"),
    (5,null,"Mark","Newark"),
    (6,7,"Opheila","Portman"),
    (6,7,"Quenton","Raskold"),
    (7,null,"Sam","Trenton"),
    (8,10,"Urusula","Vewten"),
    (8,10,"Walter","Xymaz");