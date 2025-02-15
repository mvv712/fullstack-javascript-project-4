import fsp from 'fs/promises';
import path from 'path';
import nock from 'nock';
import loadPage from '../src/page-loader.js';

nock.disableNetConnect();

const getFixturePath = (filename = '') => path.join('__fixtures__', filename);

describe('page-loader', () => {
  const url = 'https://ru.hexlet.io/courses';
  const outputDir = getFixturePath();
  const expected = getFixturePath('ru-hexlet-io-courses');

  beforeEach(() => {
    nock(url)
      .get('/')
      .reply(200, expected);
  });

  afterEach(() => {
    nock.cleanAll();
    fsp.rmdir(outputDir, { recursive: true });
  });

  test('ошибка при загрузке страницы', async () => {
    nock(url)
      .get('/')
      .reply(404);

    await expect(loadPage(url, outputDir)).toBeRejectedWith(Error, 'Ошибка загрузки страницы');
  });
});
