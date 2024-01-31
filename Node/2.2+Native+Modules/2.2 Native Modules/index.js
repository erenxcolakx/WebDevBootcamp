const fs = require("fs");

fs.writeFile("message.txt","Hello from NodeJS!", (err) => {
    if (err) throw err;
    console.log("The file has been saved!");
});


fs.readFile('message.txt',"utf-8",(err, data) => { // It should be added utf-8 to return a string in the console
  if (err) throw err;
  console.log(data);
});