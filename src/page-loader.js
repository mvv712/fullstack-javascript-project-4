import axios from 'axios';
import fsp from 'fs/promises';
import path from 'path';
import { urlToFileName } from './utils.js';
import loadFiles from './file-loader.js';

const pageLoader = async (href, output = '') => {
  let url;
  try {
    url = new URL(href);
  } catch (err) {
    throw new Error('wrong URL string');
  }

  const urlPath = path.join(output, urlToFileName(url.href));

  try {
    await fsp.access(output);
  } catch (err) {
    throw new Error('Not enough permissions in this folder');
  }

  return axios.get(url.href)
    .then(({ data }) => loadFiles(data, url, output))
    .then((html) => fsp.writeFile(urlPath, html))
    .then(() => urlPath);
};

export default pageLoader;
