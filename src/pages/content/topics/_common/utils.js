export function transformSourceToLink (sourceReference, sourceType, type) {
  let link = '';
  switch (sourceType) {
    case 'BRAND': link = `/content/brands/${type}/${sourceReference}`;
      break;
    case 'CHARACTER': link = `/content/characters/${type}/${sourceReference}`;
      break;
    case 'MEDIUM': link = '/content/media';
      break;
    case 'MOVIE': link = `/content/movies/${type}/${sourceReference}`;
      break;
    case 'TV_SERIE': link = `/content/series/${type}/${sourceReference}`;
      break;
    case 'COMMERCIAL': link = `/content/commercials/${type}/${sourceReference}`;
      break;
    case 'PERSON': link = `/content/persons/${type}/${sourceReference}`;
      break;
    default: link = '';
  }
  return link;
}
