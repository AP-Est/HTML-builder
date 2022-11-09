const path = require('path');
const fsPromises = require('fs/promises');
const fDirectory = path.join(__dirname, 'secret-folder');
const readDir = async (path) => {
  return fsPromises.readdir(path, {
    withFileTypes: true,
  });
};
const sizer = async (fPath) => {
  return fsPromises.stat(fPath);
};
const fileCheck = (stats) => {
  return stats.isFile();
};
const getName = (fPath) => {
  return path.parse(fPath).name;
};
const getType = (fPath) => {
  return path.extname(fPath).split('.')[1];
};
const getSize = (stats) => {
  const bytes = stats.size;
  const kilobytes = bytes / 1024;
  return `${kilobytes}kb`;
};
const outConcat = async (fDirectory) => {
  const files = await readDir(fDirectory);
  for (const file of files) {
    const fPath = path.join(fDirectory, file.name);
    const stats = await sizer(fPath);
    if (fileCheck(stats)) {
      console.log(
        `${getName(fPath)} - ${getType(fPath)} - ${getSize(stats)}`
      );
    }
  }
};


outConcat(fDirectory);