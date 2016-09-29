export function transformBrandSubscription ({
  brand: { logo, name, uuid: brandId },
  count
}) {
  return {
    brand: {
      name,
      logo: logo && { id: logo.uuid, url: logo.url },
      id: brandId
    },
    count
  };
}

export function transformCharacterSubscription ({
  character: { name, portraitImage, uuid: characterId },
  count,
  medium: { title, uuid: mediumId }
}) {
  return {
    character: {
      name,
      portraitImage: portraitImage && { id: portraitImage.uuid, url: portraitImage.url },
      id: characterId
    },
    count,
    medium: { id: mediumId, title }
  };
}

// Can transforms medium subscriptions and medium syncs.
export function transformMediumInfo ({
  medium: { posterImage, title, uuid: mediumId },
  count
}) {
  return {
    medium: {
      posterImage: posterImage && { id: posterImage.uuid, url: posterImage.url },
      title,
      id: mediumId
    },
    count
  };
}

export function transformProductView ({
  product: { image, shortName, uuid: productId },
  count
}) {
  return {
    product: {
      id: productId,
      image: image && { id: image.uuid, url: image.url },
      shortName
    },
    count
  };
}

export function transformActivityData (dataList, transformer) {
  const res = {};
  for (const { data, medium } of dataList) {
    res[medium.uuid] = transformer(data);
  }
  return res;
}
