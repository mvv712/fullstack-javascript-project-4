import fsp from 'fs/promises';
import path from 'path';
import nock from 'nock';
import os from 'os';
import {
  afterEach, beforeEach, expect, test, describe,
} from '@jest/globals';
import loadPage from '../src/page-loader.js';

const getFixturePath = (filename = '') => path.join('__fixtures__', filename);

nock.disableNetConnect();
const url = {
  host: 'https://ru.hexlet.io',
  page: '/courses',
  full: 'https://ru.hexlet.io/courses',
  expected: {
    file: 'ru-hexlet-io-courses.html',
    folder: 'ru-hexlet-io-courses_files',
  },
  resourses: [
    { resUrl: '/courses', resFile: 'ru-hexlet-io-courses.html' },
    { resUrl: '/assets/professions/nodejs.png', resFile: 'ru-hexlet-io-assets-professions-nodejs.png' },
    { resUrl: '/assets/application.css', resFile: 'ru-hexlet-io-assets-application.css' },
    { resUrl: '/packs/js/runtime.js', resFile: 'ru-hexlet-io-packs-js-runtime.js' },
  ],
};

let testOutput;

beforeEach(async () => {
  testOutput = await fsp.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
  const testUrlContent = await fsp.readFile(getFixturePath(url.expected.file), 'utf-8');

  const scope = nock(url.host);
  scope.get(url.page).reply(200, testUrlContent);
  url.resourses.forEach(({ resUrl, resFile }) => {
    scope.get(resUrl).replyWithFile(200, getFixturePath(path.join(resFile)));
  });
});

test('return path test', async () => {
  const received = await loadPage(url.full, testOutput);
  expect(received).toBe(path.join(testOutput, url.expected.file));
});

test('correct result', async () => {
  const receivedPath = await loadPage(url.full, testOutput);
  const receivedContent = await fsp.readFile(receivedPath, 'utf-8');
  const expectedContent = await fsp.readFile(getFixturePath('result.html'), 'utf-8');
  expect(receivedContent).toStrictEqual(expectedContent);
});

describe('load content', () => {
  test.each(url.resourses)('%s', async ({ resFile }) => {
    await loadPage(url.full, testOutput);
    const received = (await fsp.readFile(path.join(testOutput, url.expected.folder, resFile), 'utf-8')).toString();
    const expected = (await fsp.readFile(getFixturePath(resFile), 'utf-8')).toString();

    expect(received).toStrictEqual(expected);
  });
});

afterEach(async () => {
  nock.cleanAll();
  await fsp.rmdir(testOutput, { recursive: true });
});
