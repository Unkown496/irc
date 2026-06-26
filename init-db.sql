CREATE DATABASE irc;

\c irc;

-- Таблица отделов (главная)
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    budget NUMERIC(12,2) DEFAULT 0.0,
    established_date DATE
);

-- Таблица сотрудников (связанная)
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    salary NUMERIC(10,2) DEFAULT 0.0,
    hire_date DATE,
    department_id INTEGER NOT NULL,
    CONSTRAINT fk_department
        FOREIGN KEY (department_id)
        REFERENCES departments(id)
        ON DELETE CASCADE
);

-- Тестовые данные
INSERT INTO departments (name, budget, established_date) VALUES
('Разработка', 100000.00, '2010-03-15'),
('Маркетинг', 75000.00, '2012-06-20'),
('Продажи', 60000.00, '2015-09-01'),
('HR', 40000.00, '2018-01-10'),
('Финансы', 90000.00, '2008-11-05');

INSERT INTO employees (name, salary, hire_date, department_id) VALUES
('Иван Петров', 85000.00, '2015-04-12', 1),
('Мария Смирнова', 92000.00, '2016-08-23', 1),
('Алексей Иванов', 78000.00, '2017-01-19', 1),
('Елена Козлова', 65000.00, '2018-05-14', 2),
('Дмитрий Соколов', 70000.00, '2019-11-02', 2),
('Ольга Новикова', 55000.00, '2020-07-07', 3),
('Сергей Морозов', 58000.00, '2021-02-28', 3),
('Татьяна Васильева', 50000.00, '2019-10-11', 4),
('Андрей Фёдоров', 45000.00, '2020-12-01', 4),
('Наталья Егорова', 82000.00, '2014-09-17', 5);