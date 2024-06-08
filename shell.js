const fs = require("fs");

function checkPermissions(paths) {
  const permissions = {};
  paths.forEach((path) => {
    try {
      fs.accessSync(path, fs.constants.W_OK);
      permissions[path] = true;
    } catch (err) {
      permissions[path] = false;
    }
  });
  return permissions;
}

const pathsToCheck = ["/usr/local/bin", "/bin/mv", "/usr/bin/wget", "/bin/tar"];
console.log(checkPermissions(pathsToCheck));
