import fsp from 'fs/promises';
import path from 'path';
import nock from 'nock';
import os from 'os';
import loadPage from '../src/page-loader.js';

nock.disableNetConnect();
const url = {
  host: 'https://ru.hexlet.io',
  page: '/courses',
};
let testOutput;

describe('page-loader error', () => {
  beforeEach(async () => {
    nock(url.host)
      .get(url.page)
      .reply(404, 'Page not found');

    testOutput = await fsp.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
  });

  test('network error', async () => {
    await expect(() => loadPage(`${url.host}${url.page}`, testOutput)).rejects.toThrow('Request failed with status code 404');
  });

  afterEach(async () => {
    nock.cleanAll();
    await fsp.rmdir(testOutput, { recursive: true });
  });
});
