const { Client } = require('pg');
const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());

const con = new Client({
   host: "localhost",
   user: "postgres",
   port: 5432,
   password: process.env.DB_PASSWORD,
   database: "dareyio"
})

con.connect()
   .then(() => console.log("connected"))
   .catch(err => console.error("Connection error", err.stack));


con.query(`
   CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100),
      email VARCHAR(100) UNIQUE NOT NULL,
      age INTEGER
   );
   `, (err, res ) => {
      if (err) {
         console.error("Error executing query", err.stack);
      } else {
         console.log("Table created successfully");
      }
});

//GET `/users` - Get all users
app.get('/users', (req, res) => {
   const fetch_query = "SELECT * from users";

   con.query(fetch_query)
      .then(result => {
         if (result.rows.length === 0) {
            res.status(200).send("No users available yet");
         } else {
            res.status(200).json(result.rows);
         }
      })
      .catch(err => {
         console.error('Error fetching user:', err.stack);
         res.status(500).json({ error: 'Internal Server Error' });
      });     
});

//GET `/users/:id` - Get a specific user
app.get('/users/:id', (req, res) => {
   const id = req.params.id;
   fetch_query = "SELECT * from users WHERE id = $1"; 

   con.query(fetch_query, [id]) 
      .then(result => {
         if (!id) {
           res.status(400).send("Bad request!. ID do not match any data"); 
         } else {
            res.status(200).json(result.rows);
         }
      })
      .catch(err => {
         console.error('Error fetching user:', err.stack);
         res.status(500).json({ error: 'Internal Server Error' });
      });     
});


//POST `/users` - Create a new user
app.post('/users', (reg, res) => {
   const { name, email, age } = reg.body;

   const insert_query = "INSERT INTO users (name, email, age) VALUES ($1, $2, $3) RETURNING *";
   const values = [name, email, age];

   con.query(insert_query, values)
      .then(result=> {
         res.status(201).json(result.rows[0]);
         console.log(`User ${name} added successfully`);
      })
      .catch(err => {
         console.error('Error inserting user:', err.stack);
         res.status(500).json({ error: 'Internal Server Error' });
      });
});

//PUT `/users` - Update a user
app.put('/users/:id', (req, res) => {
   const { id } = req.params;
   const { name, email, age } = req.body;
   
   const update_query = `
   UPDATE users
   SET name = $1, email = $2, age =$3
   WHERE id = $4
   RETURNING *;
   `;

   const values = [name, email, age, id];

   con.query(update_query, values)
   .then(result => {
       if (result.rows.length === 0) {
        res.status(404).json({ message: "User not found or no update made" });
      } else {
        res.status(200).json(result.rows[0]);
      }
    })
    .catch(err => {
      console.error("Error updating user:", err.stack);
      res.status(500).json({ error: "Internal Server Error" });
    });  
});

//DELETE `/users` - Delete a user
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  const delete_query = 'DELETE FROM users WHERE id = $1 RETURNING *';

  con.query(delete_query, [id])
    .then(result => {
      if (result.rows.length === 0) {
        res.status(404).json({ message: "User not found" });
      } else {
        res.status(200).json({ message: `User with ID ${id} deleted`, user: result.rows[0] });
      }
    })
    .catch(err => {
      console.error('Error deleting user:', err.stack);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});


app.listen(3000, () => {
   console.log(`Server running on port http://localhost:3000`);
});
