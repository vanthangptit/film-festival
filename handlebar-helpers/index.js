import inArray from './helpers/inArray';
import and from './helpers/and';
import mergeJson from './helpers/mergeJson';
import is from './helpers/is';
import isnt from './helpers/isnt';
import gt from './helpers/gt';
import length from './helpers/length';
import json from './helpers/json';
import or from './helpers/or';
import stringify from './helpers/stringify';
import loadData from './decorators/load-data';
import loadJson from './decorators/load-json';
import getFile from './helpers/getFile';
export default {
  helpers: {
    inArray,
    and,
    getFile,
    mergeJson,
    is,
    or,
    isnt,
    json,
    gt,
    length,
    stringify,
  },
  decorators: {
    loadData,
    loadJson,
  },
};
