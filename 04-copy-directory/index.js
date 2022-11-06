const path = require('path');
const fsPromises = require('fs/promises');
const oldDir = path.join(__dirname, 'files');
const newDir = path.join(__dirname, 'files-copy');
const addDir = async (newDir) => {
  return fsPromises.mkdir(newDir, { recursive: true });
};
const dellInDir = async (newDir) => {
  return fsPromises.rm(newDir, { recursive: true }).catch((err) => {
    return null;
  });
};
const readDir = async (dir) => {
  return fsPromises.readdir(dir, {
    withFileTypes: true,
  });
};
const isDir = async (filepath) => {
  return (await fsPromises.stat(filepath)).isDirectory();
};
const copyFiles = async (filepath, newDir) => {
  return fsPromises.copyFile(filepath, newDir);
};
const copyInDir = async (dir, newDir) => {
  await dellInDir(newDir);
  addDir(newDir);
  const files = await readDir(dir);
  for (const file of files) {
    const filepath = path.join(dir, file.name);
    const isDirectoryBoolean = await isDir(filepath);
    if (!isDirectoryBoolean) {
      copyFiles(filepath, path.join(newDir, file.name));
    } else {
      copyInDir(filepath, path.join(newDir, file.name));
    }
  }
};

copyInDir(oldDir, newDir);
