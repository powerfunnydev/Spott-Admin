import { get, post } from './request';
import { transformTvGuideEntry } from './transformers';

export async function fetchTvGuide (baseUrl, authenticationToken, locale, { page = 0, pageSize = 25, sortDirection, sortField }) {
  let url = `${baseUrl}/v004/media/tvGuideEntries?page=${page}&pageSize=${pageSize}`;
  if (sortDirection && sortField && (sortDirection === 'ASC' || sortDirection === 'DESC')) {
    url = url.concat(`&sortField=${sortField}&sortDirection=${sortDirection}`);
  }
  const { body } = await get(authenticationToken, locale, url);
  // There is also usable data in body (not only in data field).
  // We need also fields page, pageCount,...
  // console.log('before transform', { ...body });
  body.data = body.data.map(transformTvGuideEntry);
  // console.log('after tranform', body);
  return body;
}

export async function persistTvGuideEntry (baseUrl, authenticationToken, locale, { mediumId, episodeId, broadcastChannelId, startDate, startTime, endDate, endTime }) {
  // Use the time and use it in the date.
  const start = startDate.hours(startTime.hours()).minutes(startTime.minutes());
  const end = endDate.hours(endTime.hours()).minutes(endTime.minutes());

  await post(authenticationToken, locale, `${baseUrl}/v004/media/tvGuideEntries`, {
    channel: broadcastChannelId,
    end: end.format(),
    start: start.format(),
    medium: { uuid: episodeId || mediumId }
  });
}
//
// export async function postBrand (authenticationToken, { basedOnDefaultLocale,
//   defaultLocale, description, externalReference, externalReferenceSource, id,
//   profileCover, locales, name, logo, publishStatus, tagLine }) {
//   try {
//     let brand = {
//       externalReference: {}
//     };
//     // Prefill entity in case it already exists
//     if (id) {
//       const { body } = await request.get(authenticationToken, `/v003/product/brands/${id}`);
//       brand = body;
//     }
//
//     // Update non-locale data.
//     brand.defaultLocale = defaultLocale;
//     brand.externalReference.reference = externalReference;
//     brand.externalReference.source = externalReferenceSource;
//     brand.publishStatus = publishStatus;
//
//     // Update locale data.
//     brand.localeData = brand.localeData || []; // Ensure we have locale data
//     locales.forEach((locale) => {
//       // Get localeData, create if necessary in O(n^2)
//       let localeData = brand.localeData.find((ld) => ld.locale === locale);
//       if (!localeData) {
//         localeData = { locale };
//         brand.localeData.push(localeData);
//       }
//       localeData.basedOnDefaultLocale = basedOnDefaultLocale[locale];
//       localeData.description = description[locale];
//       localeData.name = name[locale];
//       localeData.tagLine = tagLine[locale];
//     });
//
//     const { body } = await request.post(authenticationToken, '/v003/product/brands', brand);
//
//     // Persist the images.
//     for (const locale of locales) {
//       try {
//         await persistImageField(authenticationToken,
//           `/v003/product/brands/${body.uuid}/logo?locale=${locale}`,
//           logo[locale]);
//       } catch (e) {
//         console.warn(`Could not persist poster image (${locale}): `, e);
//       }
//       try {
//         await persistImageField(authenticationToken,
//           `/v003/product/brands/${body.uuid}/profileCover?locale=${locale}`,
//           profileCover[locale]);
//       } catch (e) {
//         console.warn(`Could not persist profile cover image (${locale}): `, e);
//       }
//     }
//
//     return transformBrand(body);
//   } catch (error) {
//     switch (error.statusCode) {
//       case 403:
//         throw new UnauthorizedError();
//     }
//     throw new UnexpectedError(error);
//   }
// }
