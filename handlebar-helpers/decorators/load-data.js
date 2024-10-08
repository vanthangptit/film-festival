import fs from 'fs';
import { get } from 'lodash';
import { getFileExtension, isJsonExtension } from '../utils/utils';

const fileCache = {};

function getFile(filename, isJson) {
  if (fileCache[filename]) {
    return fileCache[filename];
  }

  fileCache[filename] = isJson ? require(`./frontend-2/src/contents`) :
    fs.readFileSync(`./contents/${filename}`, 'utf8');

  return fileCache[filename];
}

export default (fn, props, container, context) => {
  const { variableName, path, variablePath } = context.hash;
  if (!variableName || !path) {
    throw new Error('variableName or path cannot be empty!');
  }

  const fileExtension = getFileExtension(path);
  const isJson = isJsonExtension(fileExtension);

  let content = getFile(path, isJson);

  if (isJson && variablePath) {
    content = get(content, variablePath);
  }

  context.data.root[variableName] = content;
};
