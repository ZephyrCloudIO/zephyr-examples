const { mkdirSync, writeFileSync, createWriteStream } = require("node:fs");

const getDateString = () =>
  new Date().toISOString().split(".")[0].replace(/\D/g, "");

const getLogWriteStream = (folderName, logFolder) => {
  mkdirSync(logFolder, { recursive: true });
  writeFileSync(`${logFolder}/${folderName}.txt`, "utf-8");
  return new Promise((resolve) => {
    createWriteStream(`${logFolder}/${folderName}.txt`).on("open", resolve);
  });
};

const orange = (txt) => `\x1b[0;33m${txt}\x1b[0m`;
const blue = (txt) => `\x1b[1;34m${txt}\x1b[0m`;
const yellow = (txt) => `\x1b[1;33m${txt}\x1b[0m`;
const green = (txt) => `\x1b[0;32m${txt}\x1b[0m`;
const red = (txt) => `\x1b[31m${txt}\x1b[0m`;

module.exports = {
  getDateString,
  getLogWriteStream,
  orange,
  blue,
  yellow,
  green,
  red,
};
