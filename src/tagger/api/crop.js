import { get, post } from '../../api/request';
import { transformListCrop } from '../../api/transformers';

export async function persistCrop (baseUrl, authenticationToken, locale, { basedOnDefaultLocale, comment, cropId, defaultLocale, region, sceneId, title, topicIds = [], locales }) {
  console.warn('test', { basedOnDefaultLocale, comment, cropId, defaultLocale, region, sceneId, title, topicIds, locales });

  let crop = {};
  if (cropId) {
    const { body } = await get(authenticationToken, locale, `${baseUrl}/v004/video/sceneCrops/${cropId}`);
    crop = body;
  }

  crop.area = region;
  crop.scene = { uuid: sceneId };

  crop.post = crop.post || {};
  crop.post.defaultLocale = defaultLocale;
  crop.post.topics = topicIds.map((uuid) => ({ uuid }));

  crop.post.localeData = crop.post.localeData || []; // Ensure we have locale data
  locales.forEach((locale) => {
    let localeData = crop.post.localeData.find((ld) => ld.locale === locale);
    if (!localeData) {
      localeData = { locale };
      crop.post.localeData.push(localeData);
    }
    localeData.comment = comment && comment[locale];
    localeData.title = title && title[locale];
    localeData.basedOnDefaultLocale = basedOnDefaultLocale && basedOnDefaultLocale[locale];
  });
  await post(authenticationToken, locale, `${baseUrl}/v004/video/sceneCrops`, crop);
}

export async function fetchCrops (baseUrl, authenticationToken, locale, { videoId }) {
  const { body } = await get(authenticationToken, locale, `${baseUrl}/v004/video/videos/${videoId}/sceneCrops`);
  return body.data.map(transformListCrop);
}
