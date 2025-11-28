# Online Bookstore Backend

## Overview
This backend is built with Node.js, Express, and MySQL. It provides RESTful APIs for authentication, book management, and cart operations.

## Features
- User and Admin authentication (role-based)
- Book catalogue management (CRUD)
- Cart functionality
- MySQL database integration

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure your MySQL database in `db.js`.
3. Start the backend server:
   ```bash
   node server.js
   ```

## API Endpoints
- `POST /api/auth/login` — Login for users/admins
- `POST /api/auth/register` — Register new user
- `GET /api/books` — Get all books
- `POST /api/books/add` — Add a new book (admin only)
- `POST /api/books/delete` — Delete a book (admin only)
- `POST /api/cart/add` — Add book to cart
- `POST /api/cart/remove` — Remove book from cart

## Database Tables
- `users` — Customer accounts
- `admins` — Admin accounts
- `books` — Book catalogue
- `cart` — Shopping cart items

> **Note:** Make sure to create the `admins` and `users` tables in your MySQL database. See below for example SQL.

## Example SQL for Tables
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
