# Online Bookstore Database Setup

This guide will help you create all the required tables and insert an initial admin user for your online bookstore project.

## 1. Create the Database
```sql
CREATE DATABASE IF NOT EXISTS bookstore;
USE bookstore;
```

## 2. Create Tables
```sql
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
```

## 3. Insert Initial Admin User
```sql
INSERT INTO admins (name, email, password) VALUES ('Admin', 'admin', '123456');
```

## 4. (Optional) Insert Sample Data
You can add sample books or users as needed.

---

**To run these commands:**
1. Open your terminal and start MySQL:
   ```sh
   mysql -u root -p
   ```
2. Paste the SQL commands above step by step.

Your database will now be ready for the backend and frontend to use.