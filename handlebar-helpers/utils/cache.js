let fileCache = {};

function set(filename, content) {
  fileCache[filename] = content;
}

function get(filename) {
  return fileCache[filename];
}

function invalidate() {
  fileCache = {};
}

exports.set = set;
exports.get = get;
exports.invalidate = invalidate;
