import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import env from "dotenv";

const app = express();
const port = 3000;

env.config();


let countries=[];
let totalCountries = 0;
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

app.post("/add", async (req, res) => {
  let country_name = req.body.country.trim().toLowerCase();
  try {
    const response = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';",
      [country_name]);

    const country_code = response.rows[0].country_code;

    if (countries.includes(country_code)) {
      res.render("index.ejs", {
        total: totalCountries,
        countries: countries,
        error : "Country already exists"
      });
    } else {
      try {
        await db.query("INSERT INTO visited_countries (country_code) VALUES ($1)", [country_code]);
        res.redirect("/");
      } catch (error) {
        res.render("index.ejs", {
          total: totalCountries,
          countries: countries,
          error : "Country has already been added"
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.render("index.ejs", {
      total: totalCountries,
      countries: countries,
      error: "Couldn't find Country"
    });
  }
  });

app.get("/", async (req, res) => {
  const result = await db.query("SELECT country_code FROM visited_countries");
  console.log(result.rows);
  result.rows.forEach((country) => {
    const countryCode = country.country_code;
  if (!countries.includes(countryCode)) {
    countries.push(countryCode);
  }
  });
  totalCountries = countries.length;
  res.render("index.ejs", {
    total: totalCountries,
    countries: countries,
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
