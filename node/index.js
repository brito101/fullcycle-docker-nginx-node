const express = require("express");
const mysql = require("mysql2");
const { faker } = require("@faker-js/faker");

const app = express();
const port = 3000;

const config = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
};

const connection = mysql.createConnection(config);

connection.query(`
    CREATE TABLE IF NOT EXISTS people (
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        PRIMARY KEY (id)
    );
`);

function generateRandomName() {
  return faker.person.fullName();
}

app.get("/", (req, res) => {
  const name = generateRandomName();
  connection.query(
    `INSERT INTO people(name) VALUES(?)`,
    [name],
    (err, result) => {
      if (err) {
        return res.status(500).send("Error inserting into database.");
      }

      connection.query(`SELECT name FROM people`, (err, results) => {
        if (err) {
          return res.status(500).send("Error fetching from database.");
        }

        let response = "<h1>Full Cycle Rocks!</h1>";
        response += "<ul>";
        results.forEach((row) => {
          response += `<li>${row.name}</li>`;
        });
        response += "</ul>";

        res.send(response);
      });
    }
  );
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
