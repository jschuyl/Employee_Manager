INSERT INTO department (name)
VALUES  ("Management"),
        ("Softgoods"),
        ("Hardgoods"),
        ("Shipping & Receiving"),
        ("Action Sports");

INSERT INTO role (title, salary, department_id)
VALUES  ("Manager", 80000, 1),
        ("Sales Specialist", 25000, 2),
        ("Sales Specialist", 25000, 3),
        ("Shipper Receiver", 30000, 4),
        ("Advisor", 30000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ("Jenni", "Thomas", 1, NULL),
        ("Jedediah", "Schuyler", 4, 1),
        ("Mark", "Brown", 3, 1),
        ("Benjamin", "Button", 2, 1),
        ("Samuel", "Higgins", 5, 1);

