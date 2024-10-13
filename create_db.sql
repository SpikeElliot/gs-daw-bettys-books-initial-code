-- Create database script for Bettys books

-- Create the database
CREATE DATABASE IF NOT EXISTS bettys_books;
USE bettys_books;

-- Create books table
CREATE TABLE IF NOT EXISTS books (id INT AUTO_INCREMENT,name VARCHAR(50),price DECIMAL(5, 2) unsigned,PRIMARY KEY(id));

-- Create users table
CREATE TABLE IF NOT EXISTS users (userid INT AUTO_INCREMENT,username VARCHAR(50),hashedPassword VARCHAR(100),firstname VARCHAR(50),lastname VARCHAR(50),email VARCHAR(100),PRIMARY KEY(userid));

-- Create the app user
CREATE USER IF NOT EXISTS 'bettys_books_app'@'localhost' IDENTIFIED BY 'qwertyuiop'; 
GRANT ALL PRIVILEGES ON bettys_books.* TO ' bettys_books_app'@'localhost';