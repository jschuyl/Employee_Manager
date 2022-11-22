INSERT INTO department (id, name)
VALUES  (1, "Management"),
        (2, "Softgoods"),
        (3, "Hardgoods"),
        (4, "Shipping & Receiving"),
        (5, "Action Sports");

INSERT INTO role (id, title, salary, department_id)
VALUES  (1, "Manager", 80000, 1),
        (2, "Sales Specialist", 25000, 2),
        (3, "Sales Specialist", 25000, 3),
        (4, "Shipper Receiver", 30000, 4),
        (5, "Advisor", 30000, 5);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES  (1, "Jenni", "Thomas", 1, NULL),
        (2, "Jedediah", "Schuyler", 4, 1),
        (3, "Mark", "Brown", 3, 1),
        (4, "Benjamin", "Button", 2, 1),
        (5, "Samuel", "Higgins", 5, 1);

