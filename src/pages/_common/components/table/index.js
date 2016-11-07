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
export UtilsBar from './utilsBar';

export const generalStyles = {
  arrowUnder: { transform: 'rotateZ(180deg)' },
  arrowLeft: { transform: 'rotateZ(270deg)' },
  arrowRight: { transform: 'rotateZ(90deg)' },
  searchContainer: {
    minHeight: '70px',
    display: 'flex',
    alignItems: 'center'
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

export function determineSortDirection (sortField, query) {
  let sortDirection = NONE;
  if (query.sortField === sortField && query.sortDirection) {
    // map string to number
    sortDirection = sortDirections[query.sortDirection];
  }
  return directionToString((sortDirection + 1) % 3);
}

export function isQueryChanged (query, nextQuery) {
  return (query.page !== nextQuery.page ||
    query.searchString !== nextQuery.searchString ||
    query.display !== nextQuery.display ||
    query.pageSize !== nextQuery.pageSize ||
    query.sortDirection !== nextQuery.sortDirection ||
    query.sortField !== nextQuery.sortField);
}
