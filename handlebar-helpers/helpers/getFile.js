import { get } from 'lodash';
import fs from 'fs';
import { getFileExtension, isJsonExtension } from '../utils/utils';
import cache from '../utils/cache';

function getFileInternal(filename, isJson) {
  const cachedContent = cache.get(filename);
  if (cachedContent) {
    return cachedContent;
  }

  // console.log('cur folder', process.cwd());
  const content = isJson ? JSON.parse(fs.readFileSync(`./src/content/${filename}`)) :
    fs.readFileSync(`./src/content/${filename}`, 'utf8');

  cache.set(filename, content);

  return content;
}

function getFile(filePath, variablePath, mergeVariables) {
  if (!filePath) {
    throw new Error('File path cannot be empty!');
  }
  const argumentLength = arguments.length;

  const needToMerge = mergeVariables && argumentLength > 3;

  const fileExtension = getFileExtension(filePath);
  const isJson = isJsonExtension(fileExtension);

  let content = getFileInternal(filePath, isJson);

  if (isJson && variablePath && argumentLength > 2) {
    content = get(content, variablePath);
  }

  if (needToMerge) {
    content = { ...content, ...mergeVariables };
  }

  return content;
}

export default getFile;
