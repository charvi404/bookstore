# Online Bookstore Setup

## Database
```sql
CREATE DATABASE bookstore;
USE bookstore;

CREATE TABLE admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(100)
);

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(100)
);

CREATE TABLE books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  author VARCHAR(255),
  price DECIMAL(10,2),
  image VARCHAR(255)
);

CREATE TABLE cart (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  book_id INT,
  quantity INT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (book_id) REFERENCES books(id)
);

INSERT INTO admins (name, email, password) VALUES ('Admin', 'admin', '123456');
```

## Backend Setup
```bash
cd backend
npm install
node server.js
```
Backend runs on **port 5001**

## Frontend Setup
```bash
cd frontend
npm install
npm start
```
Frontend runs on **port 3000**

## Default Admin Login
- Email: `admin`
- Password: `123456`
