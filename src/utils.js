import path from 'path';

const getFixturePath = (filename = '') => path.join('__fixtures__', filename);

const urlToName = (url, type = 'file') => {
  const { dir, name, ext } = path.parse(url);

  let host = `${dir}/${name}`.replace(/(^\w+:\/\/)/, '');
  if (host[host.length - 1].match(/[^\w]/g)) {
    host = host.slice(0, -1);
  }

  let curExt = '';
  if (type === 'file') {
    curExt = '_files';
  } else {
    curExt = ext || '.html';
  }

  return host.replace(/[^\w]/g, '-').concat(curExt);
};

export { getFixturePath, urlToName };
