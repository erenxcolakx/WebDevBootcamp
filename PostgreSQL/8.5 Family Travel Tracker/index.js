import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import env from "dotenv";

const app = express();
const port = 3000;
env.config();

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE ,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentUserId = 1;

let users = [
  { id: 1, name: "Angela", color: "teal" },
  { id: 2, name: "Jack", color: "powderblue" },
];

async function checkVisisted() {
  const result = await db.query("SELECT country_code FROM visited_countries JOIN users ON users.id = user_id WHERE user_id = $1;", [currentUserId]);
  //console.log(result.rows);
  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  return countries;
}
async function getCurrentUser() {
  const result = await db.query("SELECT * FROM users");
  users = result.rows;
  return users.find((user) => user.id == currentUserId);
}
app.get("/", async (req, res) => {
  const user = await getCurrentUser();
  const countries = await checkVisisted();
  res.render("index.ejs", {
    countries: countries,
    total: countries.length,
    users: users,
    color: user.color,
  });
});
app.post("/add", async (req, res) => {
  const input = req.body["country"];
  if (input === "" || input === null || input === undefined) {
    res.redirect("/");
  }
  const currentUser = await getCurrentUser();

  try {
    const result = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%'",
      [input.toLowerCase()]
    );

    const data = result.rows[0];
    const countryCode = data.country_code;
    try {
      if (!(input === "" || input === null || input === undefined)) {
      await db.query(
        "INSERT INTO visited_countries (country_code, user_id) VALUES ($1, $2)",
        [countryCode,currentUserId]
      );
      res.redirect("/");
    }
    } catch (err) {
      res.render("index.ejs", {
        countries: await checkVisisted(),
        total: (await checkVisisted()).length,
        users: users,
        color: currentUser.color,
        error: "You've added this country already"
      });
    }
  } catch (err) {
    console.log(err);
  }
});
app.post("/user", async (req, res) => {
  if (req.body.add === 'new') {
    res.render("new.ejs");
  }
  else {
    currentUserId = req.body.user;
    res.redirect("/");
  }
  });

  app.post("/new", async (req, res) => {
    try {
      const name = req.body.name;
      const color = req.body.color;
      if (color === undefined ) {
        // Handle the case when name or color is missing.
        res.render("new.ejs", {
          error: "Pick your color"
        });
        return;
      }
      else {
      const response = await db.query("INSERT INTO users (name, color) VALUES ($1, $2) RETURNING *;", [name, color]);
      const id = response.rows[0].id;
      currentUserId = id;
      res.redirect("/");
      }
    } catch (error) {
      console.error(error);
      res.render("new.ejs", {
        error: "Error occurred while adding user"
      });
    }
  });

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
