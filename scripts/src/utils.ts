import { mkdirSync, writeFileSync, createWriteStream, WriteStream } from "node:fs";

export const getDateString = (): string =>
  new Date().toISOString().split(".")[0].replace(/\D/g, "");

export const getLogWriteStream = (folderName: string, logFolder: string): Promise<WriteStream> => {
  mkdirSync(logFolder, { recursive: true });
  writeFileSync(`${logFolder}/${folderName}.txt`, "");
  return new Promise((resolve) => {
    const stream = createWriteStream(`${logFolder}/${folderName}.txt`);
    stream.on("open", () => resolve(stream));
  });
};

export const orange = (txt: string): string => `\x1b[0;33m${txt}\x1b[0m`;
export const blue = (txt: string): string => `\x1b[1;34m${txt}\x1b[0m`;
export const yellow = (txt: string): string => `\x1b[1;33m${txt}\x1b[0m`;
export const green = (txt: string): string => `\x1b[0;32m${txt}\x1b[0m`;
export const red = (txt: string): string => `\x1b[31m${txt}\x1b[0m`;
