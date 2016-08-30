/* eslint-disable prefer-const */
import { post, postFormData, UnexpectedError } from './request';

/**
 * Uploading content requires a three-step process.
 * 1) Requesting a file upload using POST /system/files/uploads.
 * 2) The actual upload to Amazon.
 * 3) Finally, we start video processing using POST /video/processors.
 */

/**
 * POST /system/files/uploads
 * Requesting a file upload using POST /system/files/uploads.
 * This call does not take any parameters (empty document), but returns information
 * necessary for upload. If the returned 'responseType' equals 'S3' (which we suppose),
 * we can succeed. The other responseType ('LOCAL') is probably only for backend testing
 * purposes, but that is unclear to me atm. The response includes:
 * - rootUrl (e.g., 'https://s3-eu-west-1.amazonaws.com/')
 * - bucketName (e.g., 'appiness-spott-tst')
 * - accessKey (e.g., 'AKIAI4LOLVM3ITDUOEIQ')
 * - uploadDirectory (e.g., 'private/upload/63709ad9-9188-4ae3-98ef-5c06650b20e7').
 *   This directory is unique for each call.
 * - acl (e.g., 'private')
 * - policyDocument (e.g., 'eyJleHBpcmF0aW9uIjo...')
 * - signature (e.g., 'skjEhX6+ZIZcofZzbVu3EVLvVaw=')
 * @return {object} The upload configuration for S3, which includes the bucketUrl, AWSAccessKeyId,
 * acl, policy, signature and baseKey.
 */
async function requestFileUpload (authenticationToken) {
  let { body: { responseType, s3 } } = await post(authenticationToken, null, '/v003/system/files/uploads', {});
  // The server response either has responseType 's3' or 'local'. We expect the first.
  if (responseType !== 'S3') {
    throw new UnexpectedError();
  }

  // Return the configuration for S3
  return {
    // Insert bucket name in rootUrl
    bucketUrl: s3.rootUrl.replace('://', `://${s3.bucketName}.`),
    AWSAccessKeyId: s3.accessKey,
    acl: s3.acl,
    policy: s3.policyDocument,
    signature: s3.signature,
    baseKey: s3.uploadDirectory
  };
}

 /**
  * POST /system/files/uploads, POST <s3-bucket-url>
  * Request a file upload to the server, then perform a file upload to Amazon.
  * Examples of file uploads to Amazon S2 can be found at the following URL:
  * http://docs.aws.amazon.com/AmazonS3/latest/API/sigv4-post-example.html.
  * Several remarks are in place:
  * - Since we received a unique directory uploadDirectory in the previous call, we
  *   can use any filename. However, for traceability purposes we have agreed upon
  *   using the local filename (filename at the uploading machine) as remote filename.
  * - We can plug all information we received in the previous call in our call to Amazon,
  *   although names are often slightly different:
  *   acl => acl, bucketName => bucket, signature => X-Amz-Signature, policyDocument => policy,...
  * @param {string} authenticationToken The authentication token of the logged in user.
  * @param {Object} data
  * @param {File|ReadStream} data.file The file to upload.
  * @param {function} uploadingCallback Callback that is called when HTTP request upload progress event happens.
  *                   It is called with these arguments:
  *                   - current is a number for the number of bytes currently sent.
  *                   - total is a number for the total number of bytes to be sent.
  * @returnExample {
  *   remoteFilename: 'private/upload/8b1b2b02-3826-48d6-9b1a-87d77d8211c7/testfile.mp4'
  * }
  * @throws UnauthorizedError
  * @throws UnexpectedError
  */
export async function postUpload (authenticationToken, { file }, uploadingCallback) {
  let { acl, AWSAccessKeyId, baseKey, bucketUrl, policy, signature } = await requestFileUpload(authenticationToken);

  // Perform an upload to Amazon S3
  try {
    // Build request body
    let reqBody;
    let remoteFilename;
    if (process.env.NODE_ENV === 'testing') {
      // We're in Node (testing), so we 'semi-polyfill' FormData.
      // Note: do not 'import ... from ...' this, we do not want webpack to add
      // this to the bundle.
      let FormData = require('form-data');
      reqBody = new FormData();
      // Instead of using File for files, we use Node's ReadStream.
      let path = require('path');
      remoteFilename = `${baseKey}/${path.basename(file.path)}`;
    } else {
      // Use the built-in FormData interface
      reqBody = new FormData();
      // file is a regular File
      remoteFilename = `${baseKey}/${file.name}`;
    }
    reqBody.append('AWSAccessKeyId', AWSAccessKeyId);
    reqBody.append('acl', acl);
    reqBody.append('key', remoteFilename);
    reqBody.append('policy', policy);
    reqBody.append('signature', signature);
    reqBody.append('file', file);
    // Perform the actual request.
    if (process.env.NODE_ENV === 'testing') {
      // We're in serverland (testing). Use form-data's upload instead of httpinvoke.
      // Note that this code isn't 100% foolproof and its behaviour is not 100%
      // equal to our httpinvoke counterpart, but for a naïve test it suffices.
      await new Promise((resolve, reject) => {
        reqBody.submit(bucketUrl, (err, res) => {
          if (err) { return reject(err); }
          let body = '';
          res.on('data', (chunk) => { body += chunk.toString(); });
          res.on('end', () => resolve(body));
        });
      });
    } else {
      await postFormData(null, bucketUrl, reqBody, uploadingCallback);
    }
    return { remoteFilename };
  } catch (error) {
    throw new UnexpectedError(error);
  }
}

/**
 * POST /video/processors
 * Start asynchronous processing a video file uploaded to S3 ("the Chain").
 * This call "invokes the chain", by starting an asynchronous thread. The call expects:
 * - description (!)
 * - filePathstring (!): includes path as well as filename chosen in step 1/2.
 * - externalReferenceSourcestring/externalReference:
 * - mediumExternalReferenceSourcestring/mediumExternalReferencestring: use for
 *   automatically linking the new video to a medium (episode/movie/...)
 * - skipAudio/skipScenes: boolean value set when audio/scenes should be skipped
 * As mentioned, the processing is an asynchronous process which has a status
 * chaning in time (PENDING, ERROR,...) and which can fail. Using the requestId we
 * retrieve during the post call we can check progress using GET
 * /video/processors/{requestUuid}. Upon succesful or erroneous job
 * completion, we can gather the log file via GET
 * /video/processors/{requestUuid}/log.
 * @param {string} authenticationToken
 * @param {object} data
 * @param {string} data.description A textual description of the file to process. Important!
 * @param {string} data.mediumExternalReference
 * @param {string} data.mediumExternalReferenceSource
 * @param {string} data.remoteFilename The name of a file saved on Amazon, as returned
 *                 in field remoteFilename by postPerformUpload()
 * @returnExample {
 *   requestId: '99f3ec5c-11e6-479a-9d9b-cd3549d905e7',
 *   description: 'test',
 *   outputFilename: 'data/import/input/testfile.mp4.zip'
 * }
 * @throws UnexpectedError
 */
export async function postProcess (authenticationToken, { description, mediumExternalReference, mediumExternalReferenceSource, remoteFilename, skipAudio, skipScenes }) {
  let { body } = await post(authenticationToken, null, '/v003/video/processors', {
    description,
    filePath: remoteFilename,
    mediumExternalReference,
    mediumExternalReferenceSource,
    skipAudio,
    skipScenes
  });
  // Done, return.
  return {
    requestId: body.requestId.uuid,
    description: body.description,
    outputFileName: body.outputFileName
  };
}
