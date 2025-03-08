import axios from 'axios';
import { writeFile } from 'fs/promises';
import path from 'path';
import { urlToFileName } from './utils.js';
import loadImages from './img-loader.js';

const pageLoader = (urlName, output = '') => {
  let url;
  try {
    url = new URL(urlName);
  } catch (err) {
    throw new Error('wrong URL string');
  }

  const urlPath = path.join(output, urlToFileName(url.href));

  return axios.get(url.href)
    .then(({ data }) => loadImages(data, url, output))
    .then((html) => writeFile(urlPath, html))
    .then(() => urlPath);
};

export default pageLoader;
