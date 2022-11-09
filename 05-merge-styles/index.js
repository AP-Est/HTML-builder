const fs = require('fs');
const path = require('path');
const oldDir = path.join(__dirname, 'styles');
const newDir = path.join(__dirname, 'project-dist', 'bundle.css');

fs.createWriteStream(newDir, err => {
  if (err) console.log(err);
});

(async () => {
  await fs.readdir(oldDir, { withFileTypes: true }, (err, files) => {
    if (err) console.log(err);

    for (let file of files){
      if (path.extname(file.name).slice(1) === 'css' && file.isFile()) {
        const fileAddress = path.join(oldDir, file.name);

        fs.readFile(fileAddress, 'utf-8', (err, stylesData) => {
          if (err) console.log(err);

          fs.appendFile(newDir, stylesData, (err) => {
            if (err) console.log(err);
          });
        });
      }
    }
  })
})()