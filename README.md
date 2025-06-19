# Express + PostgreSQL Mini API

This is a simple CRUD API built using **Node.js**, **Express**, and **PostgreSQL**. It allows basic user management: creating, reading, updating, and deleting users from a PostgreSQL database.

---

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)  
- [PostgreSQL](https://www.postgresql.org/)  
- A tool like [Postman](https://www.postman.com/) or [Insomnia](https://insomnia.rest/) for testing API endpoints

---

## Setup Instructions

1. **Install Node.js** (if not already installed):  
   https://nodejs.org/

2. **Install Dependencies**  
   Open your terminal in the project folder and run:
   ```bash
   npm install

3. **Create .env file In the same folder** (to prevent hardcoding password)
   DB_PASSWORD=your_postgres_password

4. **Set Up PostgreSQL**  
  CREATE DATABASE dareyio;
