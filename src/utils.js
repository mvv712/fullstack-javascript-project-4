import path from 'path';

const getFixturePath = (filename = '') => path.join('__fixtures__', filename);

const urlToFileName = (url) => {
  const fileExts = ['png', 'jpeg', 'jpg', 'css', 'js'];
  const getFileExtension = (fileName) => {
    const match = fileName.match(/\.([a-zA-Z0-9]+)$/);
    return match ? match[1] : null;
  };

  let host = url.replace(/(^\w+:\/\/)/, '');
  const ext = getFileExtension(host);

  if (host[host.length - 1].match(/[^\w]/g)) {
    host = host.slice(0, -1);
  }

  if (!fileExts.includes(ext)) {
    return host.replace(/[^\w]/g, '-').concat('.html');
  }

  return host.replace(/(\.[a-zA-Z0-9]+)$/, '').replace(/[^\w]/g, '-').concat(`.${ext}`);
};

const urlToFolderName = (url) => {
  let host = url.replace(/(^\w+:\/\/)/, '');
  if (host[host.length - 1].match(/[^\w]/g)) {
    host = host.slice(0, -1);
  }
  return host.replace(/[^\w]/g, '-').concat('_files');
};

export { getFixturePath, urlToFileName, urlToFolderName };
