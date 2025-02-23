import axios from 'axios';
import { writeFile } from 'fs/promises';
import path from 'path';
import { urlToFileName } from './utils.js';

const pageLoader = (urlName, output = '') => {
  let url;
  try {
    url = new URL(urlName);
  } catch (err) {
    throw new Error('wrong URL string');
  }

  const urlSavePath = path.join(output, urlToFileName(url.href));
  return axios.get(urlName)
    .then(({ data }) => writeFile(urlSavePath, data))
    .then(() => urlSavePath);
};

export default pageLoader;
