import axios from 'axios';
import fsp from 'fs/promises';
import path from 'path';
import { urlToFileName, checkAccess } from './utils.js';
import loadFiles from './file-loader.js';

const pageLoader = async (href, output = '') => {
  let url;
  try {
    url = new URL(href);
  } catch (err) {
    throw new Error('wrong URL string');
  }

  const urlPath = path.join(output, urlToFileName(url.href));

  return checkAccess(output)
    .then(() => axios.get(url.href))
    .then(({ data }) => loadFiles(data, url, output))
    .then((html) => fsp.writeFile(urlPath, html))
    .then(() => console.log(urlPath))
    .catch((err) => console.error(`Failed to load data from URL: ${err}`));
};

export default pageLoader;
