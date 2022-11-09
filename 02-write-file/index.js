const fs = require('fs'); 
const path = require('path');
const { stdin, stdout } = require('process');


const WriteStream = fs.createWriteStream(path.join(__dirname, 'notes.txt'));


stdout.write('Введите текст: \n');
stdin.on('data' , data => { 
  if (data.toString().trim() === 'exit') { 
    stdout.write('Пока-пока!');
    process.exit();
  } else {
    WriteStream.write(data.toString());
  }
});

process.on('SIGINT', () => {
  stdout.write('Пока-пока!');
  process.exit();
});
