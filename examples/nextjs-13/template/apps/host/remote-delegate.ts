module.exports = new Promise(async (resolve, reject) => {
  try {
    resolve((await import('./ze-plugin/ze-remote-delegate')).default(__resourceQuery));
  } catch (error) {
    reject(error);
  }
});
