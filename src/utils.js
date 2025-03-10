import path from 'path';

const getFixturePath = (filename = '') => path.join('__fixtures__', filename);

const urlToFileName = (url) => {
  const fileExts = ['png', 'jpeg', 'jpg', 'css', 'js'];

  const host = url.split('://').length === 2 ? url.split('://')[1] : url.split('://')[0];
  const hostElems = host.split('.');
  const ext = hostElems.pop();

  if (!fileExts.includes(ext)) {
    return host.replace(/[^\w]/g, '-').concat('.html');
  }
  return hostElems.join('.').replace(/[^\w]/g, '-').concat(`.${ext}`);
};

const urlToFolderName = (url) => {
  const host = url.split('://').length === 2 ? url.split('://')[1] : url.split('://')[0];
  return host.replace(/[^\w]/g, '-').concat('_files');
};

export { getFixturePath, urlToFileName, urlToFolderName };
