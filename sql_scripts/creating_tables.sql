-- CREATE DATABASE cibaria_db;
DROP TABLE IF EXISTS rating;
DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS recipe;
USE cibaria_db;

CREATE TABLE Recipe (
	id int AUTO_INCREMENT,
    recipe_name varchar(255),
    created_at datetime,
    difficulty int,
    prepare_time int,
    servings int,
    category varchar(255),
    
    PRIMARY KEY(id)
);

CREATE TABLE Ingredient (
	id int AUTO_INCREMENT,
    recipe_id int,
    ingredient_name varchar(255),
    quantity int,
    unit varchar(25),
    
    PRIMARY KEY(id),
	FOREIGN KEY(recipe_id) REFERENCES Recipe(id) ON DELETE CASCADE
);

CREATE TABLE Tag (
	id int AUTO_INCREMENT,
    recipe_id int,
    tag_name varchar(255),
    
    PRIMARY KEY(id),
    FOREIGN KEY(recipe_id) REFERENCES Recipe(id) ON DELETE CASCADE
);

CREATE TABLE User (
	id int AUTO_INCREMENT,
    username varchar(255),
    password varchar(64),
    email varchar(255),
    
    PRIMARY KEY(id)
);

CREATE TABLE Rating (
	rating_id int AUTO_INCREMENT,
    user_id int NOT NULL,
    recipe_id int NOT NULL,
    value int NOT NULL,
    
    PRIMARY KEY(rating_id),
    FOREIGN KEY(recipe_id) REFERENCES Recipe(id) ON DELETE CASCADE,
    FOREIGN KEY(user_id) REFERENCES User(id) ON DELETE CASCADE
);


-- Dodawanie danych do tabeli Recipe
INSERT INTO Recipe (recipe_name, created_at, difficulty, prepare_time, servings, category)
VALUES
('Spaghetti Bolognese', '2024-12-01 12:00:00', 2, 30, 4, 'Italian'),
('Chicken Curry', '2024-12-02 18:30:00', 3, 45, 4, 'Indian'),
('Pancakes', '2024-12-03 08:00:00', 1, 20, 2, 'Breakfast');

-- Dodawanie danych do tabeli Ingredient
INSERT INTO Ingredient (recipe_id, ingredient_name, quantity, unit)
VALUES
(1, 'Spaghetti', 200, 'g'),
(1, 'Ground Beef', 300, 'g'),
(1, 'Tomato Sauce', 250, 'ml'),
(2, 'Chicken Breast', 500, 'g'),
(2, 'Curry Powder', 2, 'tbsp'),
(2, 'Coconut Milk', 400, 'ml'),
(3, 'Flour', 100, 'g'),
(3, 'Milk', 200, 'ml'),
(3, 'Egg', 2, 'pcs');

-- Dodawanie danych do tabeli Tag
INSERT INTO Tag (recipe_id, tag_name)
VALUES
(1, 'Dinner'),
(1, 'Pasta'),
(2, 'Spicy'),
(2, 'Main Course'),
(3, 'Sweet'),
(3, 'Quick');

-- Dodawanie danych do tabeli User
INSERT INTO User (username, password, email)
VALUES
('john_doe', 'password123', 'john.doe@example.com'),
('jane_smith', 'securePass456', 'jane.smith@example.com'),
('chef_alex', 'alex@cooking789', 'alex.chef@example.com');

-- Dodawanie danych do tabeli Rating
INSERT INTO Rating (user_id, recipe_id, value)
VALUES
(1, 1, 5),
(2, 2, 4),
(3, 3, 3);