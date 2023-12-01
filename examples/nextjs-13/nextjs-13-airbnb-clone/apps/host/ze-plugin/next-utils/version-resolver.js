const { execSync } = require('child_process');

const versionResolver = () => {
  const gitSHA = execSync(`git rev-list -n 1 HEAD -- .`, { cwd: process.cwd() })
    .toString()
    .trim();
  return gitSHA;
};

exports.versionResolver = versionResolver;
