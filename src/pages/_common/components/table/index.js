import { colors, makeTextStyle } from '../../../_common/styles';

export { CheckBoxCel } from './checkboxCel';
export { CustomCel } from './customCel';
export { Headers } from './headers';
export { Pagination } from './pagination';
export { Row } from './row';
export { Rows } from './rows';
export { Table } from './table';
export { tableDecorator } from './tableDecorator';
export { Tile } from './tile';
export { TotalEntries } from './totalEntries';
export { DropdownCel } from './dropdownCel';
export UtilsBar from './utilsBar';

export const generalStyles = {
  lightGrayBorder: {
    border: `1px solid ${colors.lightGray2}`
  },
  whiteBackground: {
    backgroundColor: colors.white
  },
  border: {
    marginTop: '-1px',
    border: `solid 1px ${colors.lightGray3}`,
    borderBottomLeftRadius: '2px',
    borderTopRightRadius: '2px',
    borderBottomRightRadius: '2px'
  },
  arrowUnder: { transform: 'rotateZ(180deg)' },
  arrowLeft: { transform: 'rotateZ(270deg)' },
  arrowRight: { transform: 'rotateZ(90deg)' },
  searchContainer: {
    minHeight: '70px',
    display: 'flex',
    alignItems: 'center'
  },
  paddingLeftAndRight: {
    paddingLeft: '24px',
    paddingRight: '24px'
  },
  paddingTable: {
    paddingTop: '50px',
    paddingBottom: '50px'
  },
  backgroundBar: {
    backgroundColor: colors.veryLightGray
  },
  backgroundTable: {
    backgroundColor: colors.lightGray
  },
  fillPage: {
    flex: 1
  },
  floatRight: {
    marginLeft: 'auto'
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  tableFillPage: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  }
};

export const headerStyles = {
  header: {
    minHeight: '32px',
    ...makeTextStyle(null, '11px', '0.50px'),
    textTransform: 'uppercase'
  },
  firstHeader: {
    borderBottom: `1px solid ${colors.lightGray2}`
  },
  notFirstHeader: {
    borderLeft: `1px solid ${colors.lightGray2}`,
    borderBottom: `1px solid ${colors.lightGray2}`
  },
  clickableHeader: {
    ':hover': {
      backgroundColor: colors.lightGray4
    }
  }
};

export function concatCamelCase (word, prefix) {
  if (typeof prefix === 'string') {
    return `${prefix}${word.charAt(0).toUpperCase()}${word.substr(1)}`;
  }
  return word;
}

export const sortDirections = {
  ASC: 1,
  DESC: 2
};
export const NONE = 0;
export const ASC = 1;
export const DESC = 2;

export function directionToString (direction) {
  if (direction === ASC) {
    return 'ASC';
  } else if (direction === DESC) {
    return 'DESC';
  }
  return '';
}

export function determineSortDirection (sortField, querySortField, querySortDirection) {
  let sortDirection = NONE;
  if (querySortField === sortField && querySortDirection) {
    // map string to number
    sortDirection = sortDirections[querySortDirection];
  }
  return directionToString((sortDirection + 1) % 3);
}

export const isQueryChanged = (query, nextQuery, prefix) => {
  const prefixPage = concatCamelCase('page', prefix);
  const prefixSearchString = concatCamelCase('searchString', prefix);
  const prefixPageSize = concatCamelCase('pageSize', prefix);
  const prefixSortDirection = concatCamelCase('sortDirection', prefix);
  const prefixSortField = concatCamelCase('sortField', prefix);

  return (
    (query[prefixPage] !== nextQuery[prefixPage]) ||
    (query[prefixSearchString] !== nextQuery[prefixSearchString]) ||
    (query[prefixPageSize] !== nextQuery[prefixPageSize]) ||
    (query[prefixSortDirection] !== nextQuery[prefixSortDirection]) ||
    (query[prefixSortField] !== nextQuery[prefixSortField]));
};

export function getInformationFromQuery (query, prefix) {
  return {
    page: query[concatCamelCase('page', prefix)],
    searchString: query[concatCamelCase('searchString', prefix)],
    display: query[concatCamelCase('display', prefix)],
    pageSize: query[concatCamelCase('pageSize', prefix)],
    sortDirection: query[concatCamelCase('sortDirection', prefix)],
    sortField: query[concatCamelCase('sortField', prefix)]
  };
}
