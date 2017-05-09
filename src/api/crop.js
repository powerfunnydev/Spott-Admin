import { del, get, post } from './request';
import { transformCrop, transformListCrop } from './transformers';

export async function persistCrop (baseUrl, authenticationToken, locale, { basedOnDefaultLocale, comment, cropId, defaultLocale, region, sceneId, title, topicIds = [], locales }) {
  let crop = {};
  if (cropId) {
    const { body } = await get(authenticationToken, locale, `${baseUrl}/v004/video/sceneCrops/${cropId}`);
    crop = body;
  }

  crop.area = {
    height: Math.round(region.height),
    width: Math.round(region.width),
    x: Math.round(region.x),
    y: Math.round(region.y)
  };
  crop.scene = { uuid: sceneId };

  crop.post = crop.post || {};
  crop.post.defaultLocale = defaultLocale;
  crop.post.topics = topicIds.map((uuid) => ({ uuid }));

  crop.post.localeData = [];
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

export async function deleteCrop (baseUrl, authenticationToken, locale, { cropId }) {
  await del(authenticationToken, locale, `${baseUrl}/v004/video/sceneCrops/${cropId}`);
}

export async function deleteCrops (baseUrl, authenticationToken, locale, { cropIds }) {
  for (const cropId of cropIds) {
    await deleteCrop(baseUrl, authenticationToken, locale, { cropId });
  }
}

export async function fetchCrop (baseUrl, authenticationToken, locale, { cropId }) {
  const { body } = await get(authenticationToken, locale, `${baseUrl}/v004/video/sceneCrops/${cropId}`);
  return transformCrop(body);
}

export async function fetchCrops (baseUrl, authenticationToken, locale, { videoId }) {
  const { body } = await get(authenticationToken, locale, `${baseUrl}/v004/video/videos/${videoId}/sceneCrops?pageSize=1000`);
  return body.data.map(transformListCrop);
}
