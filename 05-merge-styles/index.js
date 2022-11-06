const path = require('path');
const fsPromises = require('fs/promises');
const fs = require('fs');
const styleDir = path.join(__dirname, 'styles');
const resultDir = path.join(__dirname, 'project-dist');
const readFiles = async (dir) => {
  return fsPromises.readdir(dir, {
    withFileTypes: true,
  });
};
const fileCheck = async (dataPath) => {
  const stats = await fsPromises.stat(dataPath);
  return stats.isFile();
};
const cssCheck = (dataPath) => {
  const extension = path.extname(dataPath);
  return extension === '.css' ? true : false;
};
const addCssFile = async (dist) => {
  return fsPromises.writeFile(path.join(dist, 'bundle.css'), '');
};
const createCss = async (src, dist) => {
  await addCssFile(dist);
  const output = fs.createWriteStream(path.join(dist, 'bundle.css'));
  const files = await readFiles(src);
  for (const file of files) {
    const dataPath = path.join(src, file.name);
    const isFileBoolean = await fileCheck(dataPath);
    const isCssBoolean = cssCheck(dataPath);
    if (isFileBoolean & isCssBoolean) {
      const input = fs.createReadStream(dataPath, 'utf-8');
      input.pipe(output);
    }
  }
};

createCss(styleDir, resultDir);