import axios from 'axios';
import { writeFile } from 'fs/promises';
import path from 'path';
import { urlToFileName } from './utils.js';
import loadFiles from './file-loader.js';

const pageLoader = (href, output = '') => {
  let url;
  try {
    url = new URL(href);
  } catch (err) {
    throw new Error('wrong URL string');
  }

  const urlPath = path.join(output, urlToFileName(url.href));

  return axios.get(url.href)
    .then(({ data }) => loadFiles(data, url, output))
    .then((html) => writeFile(urlPath, html))
    .then(() => urlPath);
};

export default pageLoader;
