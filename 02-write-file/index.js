const fs = require('fs');
const path = require('path');
const { exit } = require('process');
const { stdout, stdin } = process;

stdout.write('Введите, текст\n');
stdin.on ('data', data => { 

const message = data.toString();
    if (message == 'exit\r\n') {
        process.on('exit', () => stdout.write ('Пока-пока\n'))
        exit();
    }

    else if (!path.join(__dirname, 'notes.txt')) {
    fs.writeFile(
        path.join(__dirname, 'notes.txt'),
        message,
        (err) => {
            if (err) throw err;
            stdout.write('Файл был создан\n');
        }
    )
    } else {
        fs.appendFile(
            path.join(__dirname, 'notes.txt'),
            message,
            err => {
                if (err) throw err;
                stdout.write('Файл был дополнен\n');
            }
        )
    }
    process.on('SIGINT', () => {
        stdout.write ('Пока-пока\n')
        exit();
    });
})
