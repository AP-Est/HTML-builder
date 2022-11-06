const path = require('path');
const fsPromises = require('fs/promises');
const fs = require('fs');
const projectDir = path.join(__dirname, 'project-dist');
const readFile = async (dataPath) => {
  return fsPromises.readFile(dataPath, 'utf-8');
};
const readDir = async (dir) => {
  return fsPromises.readdir(dir, {
    withFileTypes: true,
  });
};
const addDir = async (newDir) => {
  return fsPromises.mkdir(newDir, { recursive: true });
};
const dellInDir = async (dir) => {
  return fsPromises.rm(dir, { recursive: true }).catch((err) => {
    return null;
  });
};
const createWrite = async (dataPath) => {
  return new Promise((resolve) => {
    const ret = fs.createWriteStream(dataPath);
    resolve(ret);
  });
};
const getComp = async (compDir) => {
  const compFiles = await readDir(compDir);
  return compFiles.reduce(async (prevPromise, file) => {
    if (file.name.slice(-5) === '.html') {
      const arr = await prevPromise;
      const name = `{{${file.name.slice(0, -5)}}}`;
      const data = await readFile(path.join(compDir, file.name));
      const rez = { name, data };
      return [...arr, rez];
    }
  }, Promise.resolve([]));
};
const takeModel = (dataModel, comp) => {
  let data = dataModel;
  comp.forEach((component) => {
    if (data.includes(component.name)) {
      let find = new RegExp(component.name, 'g');
      let newData = data.replace(find, component.data);
      data = newData;
    }
  });
  return data;
};
const fillModel = async (src, compDir, projectDir) => {
  const ret = await createWrite(path.join(projectDir, 'index.html'));
  const a = await getComp(compDir);
  const b = await readFile(src);
  const c = takeModel(b, a);
  ret.write(c);
  ret.end();
};
const fileCheck = async (dataPath) => {
  const stats = await fsPromises.stat(dataPath);
  return stats.isFile();
};
const cssCheck = (dataPath) => {
  const x = path.extname(dataPath);
  return x === '.css' ? true : false;
};
const fillCss = async (src, projectDir) => {
  const ret = await createWrite(path.join(projectDir, 'style.css'));
  const files = await readDir(src);
  for (const file of files) {
    const dataPath = path.join(src, file.name);
    const x = await fileCheck(dataPath);
    const y = cssCheck(dataPath);
    if (x & y) {
      const data = await readFile(dataPath);
      ret.write(data);
    }
  }
  ret.end();
};
const dirCheck = async (dataPath) => {
  return (await fsPromises.stat(dataPath)).isDirectory();
};
const copyFile = async (dataPath, newDir) => {
  return fsPromises.copyFile(dataPath, newDir);
};
const fillDir = async (dir, newDir) => {
  await addDir(newDir);
  const files = await readDir(dir);
  for (const file of files) {
    const dataPath = path.join(dir, file.name);
    const a = await dirCheck(dataPath);
    if (!a) {
      copyFile(dataPath, path.join(newDir, file.name));
    } else {
      fillDir(dataPath, path.join(newDir, file.name));
    }
  }
};
const createPage = async (projectDir) => {
  await dellInDir(projectDir);
  await addDir(projectDir);
  await fillModel(
    path.join(__dirname, 'template.html'),
    path.join(__dirname, 'components'),
    projectDir
  );
  await fillCss(path.join(__dirname, 'styles'), projectDir);
  fillDir(
    path.join(__dirname, 'assets'),
    path.join(projectDir, 'assets')
  );
};

createPage(projectDir);