import path from 'path';

const getFixturePath = (filename = '') => path.join('__fixtures__', filename);

const urlToFileName = (url) => url.split('://')[1].replace(/[^\w]/g, '-').concat('.html');

export { getFixturePath, urlToFileName };
