import axios from 'axios';
import { writeFile } from 'fs/promises';
import path from 'path';

const urlToFileName = (url) => url.split('://')[1].replace(/[^\w]/g, '-').concat('.html');

const pageLoader = (urlName, output = '') => {
  let url;
  try {
    url = new URL(urlName);
  } catch (err) {
    throw new Error('wrong URL string');
  }

  const urlSavePath = path.join(output.output, urlToFileName(urlName));
  return axios.get(urlName)
    .then(({ data }) => writeFile(urlSavePath, data))
    .then(() => urlSavePath);
};

export default pageLoader;
