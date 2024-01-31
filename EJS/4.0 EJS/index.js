import express from "express";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
    const day = new Date("June 23, 2023 11:13:00");
    const currentDay = day.getDay();
    let type = "a weekday";
    let adv = "it's time to work hard";

    if (currentDay === 6 || currentDay === 0) {
        type = "the weekend";
        adv = "it's time to have some fun";
    }
    res.render("index.ejs",{
        dayType:type,
        advice:adv,
    })

});
app.listen(port, () => {
    console.log(`Server running on port ${port}.`);
  });
