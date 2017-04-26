/* eslint-disable prefer-const */
import AWS from 'aws-sdk';
import { get, post, UnexpectedError, del } from './request';
import { transformMedium, transformListMedium, transformTvGuideEntry } from './transformers';

function uploadToS3 ({ accessKeyId, acl, baseKey, bucket, file, policy, signature }, uploadingCallback) {
  return new Promise((resolve, reject) => {
    // Constructs a service interface object. A specific api version can be provided.
    const s3 = new AWS.S3({ accessKeyId, secretAccessKey: 'WtDWvDohG6HKM2YV7hRStNoymSTCca66DVyBJtGj' });

    s3.upload({ Body: file, Bucket: bucket, Key: `${baseKey}/${file.name}`, Policy: policy, Signature: signature })
      .on('httpUploadProgress', (e) => {
        uploadingCallback(e.loaded, e.total);
      })
     .send((err, data) => {
       if (err) {
         return reject(err);
       }
       resolve();
     });
  });
}

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
async function requestFileUpload (baseUrl, authenticationToken) {
  let { body: { responseType, s3 } } = await post(authenticationToken, null, `${baseUrl}/v003/system/files/uploads`, {});
  // The server response either has responseType 's3' or 'local'. We expect the first.
  if (responseType !== 'S3') {
    throw new UnexpectedError();
  }

  // Return the configuration for S3
  return {
    accessKeyId: s3.accessKey,
    acl: s3.acl,
    bucket: s3.bucketName,
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
export async function postUpload (baseUrl, authenticationToken, { file }, uploadingCallback) {
  let { accessKeyId, acl, baseKey, bucket, bucketUrl, policy, signature } = await requestFileUpload(baseUrl, authenticationToken);

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
    reqBody.append('AWSAccessKeyId', accessKeyId);
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
      await uploadToS3({ accessKeyId, acl, baseKey, bucket, file, policy, signature }, uploadingCallback);
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
export async function postProcess (baseUrl, authenticationToken, { description, mediumExternalReference, mediumExternalReferenceSource, remoteFilename, skipAudio, skipScenes }) {
  let { body } = await post(authenticationToken, null, `${baseUrl}/v003/video/processors`, {
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

/**
  * @returnExample
  * {
  *   basedOnDefaultLocale: { en: false, fr: true, nl: false },
  *   mediumCategories: [ '123', '124', '1235' ],
  *   defaultLocale: 'en',
  *   description: { en: 'Home', fr: 'A la maison', nl: 'Thuis' },
  *   externalReference: '...',
  *   externalReferenceSource: '...',
  *   id: 'abcdef123',
  *   locales: [ 'en', 'fr', 'nl' ],
  *   poster: { en: ..., fr: ..., nl: ... }
  *   publishStatus: 'DRAFT' || 'REVIEW' || 'PUBLISHED',
  *   relatedCharacterIds: [ '1234', '1235', ... ],
  *   keyVisual: { en: ..., fr: ..., nl: ... },
  *   startYear: { en: 1991, fr: 1991, nl: 1991 },
  *   endYear: { en: 2000, fr: 2000, nl: 2000 },
  *   title: { en: 'Home', fr: 'A la maison', nl: 'Thuis' }
  * }
  */

/**
 * GET /media/series?searchString=...
 * Search for series.
 * @param {string} authenticationToken The authentication token of the logged in user.
 * @param {Object} data
 * @param {string} [data.searchString=''] The string to search products on.
 * @throws UnauthorizedError
 * @throws UnexpectedError
 */
export async function searchMedia (baseUrl, authenticationToken, locale, { searchString = '' }) {
  let searchUrl = `${baseUrl}/v004/media/media?pageSize=1000&types=TV_SERIE,MOVIE,COMMERCIAL`;
  if (searchString) {
    searchUrl += `&searchString=${encodeURIComponent(searchString)}`;
  }
  const { body: { data } } = await get(authenticationToken, locale, searchUrl);
  return data.map(transformListMedium);
}

export async function deletePosterImage (baseUrl, authenticationToken, locale, { locale: mediumLocale, mediumId }) {
  let url = `${baseUrl}/v004/media/media/${mediumId}/posterImage`;
  if (mediumLocale) {
    url = `${url}?locale=${mediumLocale}`;
  }
  const result = await del(authenticationToken, locale, url);
  return transformMedium(result.body);
}

export async function fetchMedia (baseUrl, authenticationToken, locale, { searchString = '', page = 0, pageSize = 25, sortDirection, sortField }) {
  let url = `${baseUrl}/v004/media/media?page=${page}&pageSize=${pageSize}`;
  if (searchString) {
    url = url.concat(`&searchString=${encodeURIComponent(searchString)}`);
  }
  if (sortDirection && sortField && (sortDirection === 'ASC' || sortDirection === 'DESC')) {
    url = url.concat(`&sortField=${sortField}&sortDirection=${sortDirection}`);
  }
  const { body } = await get(authenticationToken, locale, url);
  // There is also usable data in body (not only in data field).
  // We need also fields page, pageCount,...
  body.data = body.data.map(transformListMedium);
  return body;
}

export async function deleteProfileImage (baseUrl, authenticationToken, locale, { locale: mediumLocale, mediumId }) {
  let url = `${baseUrl}/v004/media/media/${mediumId}/profileCover`;
  if (mediumLocale) {
    url = `${url }?locale=${mediumLocale}`;
  }
  const result = await del(authenticationToken, locale, url, { locale: mediumLocale });
  return transformMedium(result.body);
}

export async function deleteRoundLogo (baseUrl, authenticationToken, locale, { locale: mediumLocale, mediumId }) {
  let url = `${baseUrl}/v004/media/media/${mediumId}/roundLogo`;
  if (mediumLocale) {
    url = `${url }?locale=${mediumLocale}`;
  }
  const result = await del(authenticationToken, locale, url, { locale: mediumLocale });
  return transformMedium(result.body);
}

export async function fetchTvGuideEntries (baseUrl, authenticationToken, locale, { searchString = '', page = 0, pageSize = 25, sortDirection, sortField, mediumId }) {
  let url = `${baseUrl}/v004/media/media/${mediumId}/tvGuideEntries?page=${page}&pageSize=${pageSize}&mediumUuid=${mediumId}`;
  if (searchString) {
    url = url.concat(`&searchString=${encodeURIComponent(searchString)}`);
  }
  if (sortDirection && sortField && (sortDirection === 'ASC' || sortDirection === 'DESC')) {
    url = url.concat(`&sortField=${sortField}&sortDirection=${sortDirection}`);
  }
  const { body } = await get(authenticationToken, locale, url);
  // There is also usable data in body (not only in data field).
  // We need also fields page, pageCount,...
  body.data = body.data.map(transformTvGuideEntry);
  return body;
}

export async function fetchMedium (baseUrl, authenticationToken, locale, { mediumId }) {
  const { body } = await get(authenticationToken, locale, `${baseUrl}/v004/media/media/${mediumId}`);
  return transformMedium(body);
}
