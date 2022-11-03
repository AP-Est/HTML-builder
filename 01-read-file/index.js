const fs = require('fs');
const path = require('path')
const text = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');
text.on('data', toConsole => console.log(toConsole));