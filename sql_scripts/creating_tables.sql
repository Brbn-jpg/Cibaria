-- CREATE DATABASE cibaria_db;
DROP TABLE IF EXISTS rating;
DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS recipe;
USE cibaria_db;

CREATE TABLE Recipe (
	id int AUTO_INCREMENT,
    name varchar(255),
    created_at date,
    difficulty bit,
    ingredients json,
    prepare_time tinyint,
    servings bit,
    category varchar(255),
    tag json,
    rating json,
    
    PRIMARY KEY(id)
);

CREATE TABLE User (
	id int,
    username varchar(255),
    password varchar(64),
    email varchar(255),
    favourites json,
    rating json,
    
    PRIMARY KEY(id)
);

CREATE TABLE Rating (
	rating_id int AUTO_INCREMENT,
    user_id int NOT NULL,
    recipe_id int NOT NULL,
    value bit NOT NULL,
    
    PRIMARY KEY(rating_id),
    FOREIGN KEY(recipe_id) REFERENCES Recipe(id) ON DELETE CASCADE,
    FOREIGN KEY(user_id) REFERENCES User(id) ON DELETE CASCADE
);

