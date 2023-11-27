module.exports = new Promise(async (resolve, reject) => {
  try {
    resolve((await import('../ze-remote-delegate')).default(__resourceQuery));
  } catch (error) {
    reject(error);
  }
});
