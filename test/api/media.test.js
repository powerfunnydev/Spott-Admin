import { expect } from 'chai';
import * as data from './_data';
import { expectError } from './_utils';
import * as userApi from '../../src/api/user';
import * as mediaApi from '../../src/api/media';
import * as fs from 'fs';
import * as path from 'path';

const file = fs.createReadStream(path.join(__dirname, 'testfile.jpg'));

describe('API: Media', () => {

  let authenticationToken;
  let remoteFilename;
  let requestId;

  before(async () => {
    authenticationToken = await userApi.postLogin(data.loginData);
  });

  it('upload succeeds', async () => {
    const result = await mediaApi.postUpload(authenticationToken, { file });
    expect(result).to.have.all.keys('remoteFilename');
    expect(result.remoteFilename).to.match(/testfile\.jpg$/);
    remoteFilename = result.remoteFilename;
  });

  expectError('upload throws an unauthorized error on invalid authentication token', 'Should be unauthorized.', 'UnauthorizedError', async () => {
    await mediaApi.postUpload('invalid-token', { file });
  });

  it('start processing succeeds', async () => {
    const result = await mediaApi.postProcess(authenticationToken, {
      description: 'test',
      remoteFilename
    });
    expect(result).to.have.all.keys('description', 'outputFileName', 'requestId');
    expect(result.description).to.be.a('string');
    expect(result.outputFileName).to.be.a('string');
    expect(result.requestId).to.be.a('string');
    requestId = result.requestId;
  });

  it('poll status of a process request of a video', async () => {
    const result = await mediaApi.getProcessProgress(authenticationToken, { requestId });
    expect(result).to.have.all.keys('status');
    expect(result.status).to.be.a('string');
  });

  it('get the process logs after a video has been processed processed', async () => {
    const result = await mediaApi.getProcessLog(authenticationToken, { requestId });
    console.log(result);
  });

});
