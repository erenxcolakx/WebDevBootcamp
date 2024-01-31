import inquirer from "inquirer";
import qr from "qr-image";
import fs from "fs";

inquirer
  .prompt([
    {
      message: 'Enter link:',
      name: 'link',
    }
  ])
  .then((answers) => {
    const url = answers.link;
    var qr_png = qr.image(url, { type: 'png' }); // Fix the variable name to 'url'
    qr_png.pipe(fs.createWriteStream('qr_code.png'));
    fs.writeFile('URL.txt', url, 'utf8', (err) => {
      if (err) throw err;
      console.log('The file has been saved!');
    });
  })
  .catch((error) => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else went wrong
    }
  });
