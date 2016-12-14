import colors from '../colors';

export default {
  count: {
    color: colors.warmGray,
    marginLeft: 3
  },
  error: {
    color: colors.vividRed,
    fontSize: '13px'
  },
  list: {
    backgroundColor: colors.black2,
    // Remove default ul style
    listStyle: 'none',
    marginBottom: 1,
    marginTop: 0,
    padding: 20,
    width: '100%'
  },
  title: {
    backgroundColor: colors.black1,
    color: 'white',
    fontFamily: 'Rubik-Regular',
    fontSize: '14px',
    padding: '13px 20px'
  }
};
