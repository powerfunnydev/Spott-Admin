import { colors } from '../../../_common/styles';

export default {
  body: {
    minHeight: 340,
    padding: '30px 34px 30px 34px'
  },
  inputText: {
    border: '1px solid rgb(187, 190, 193)',
    borderRadius: 4,
    fontFamily: 'Rubik-Regular',
    fontSize: '16px',
    height: 38,
    marginTop: 10,
    padding: 6,
    width: '100%'
  },
  label: {
    color: 'rgb(125, 129, 135)'
  },
  message: {
    color: 'rgb(125, 129, 135)',
    fontFamily: 'Rubik-Light',
    fontSize: '16px',
    margin: '0 0 30px 0'
  },
  title: {
    color: colors.black,
    fontFamily: 'Rubik-Light',
    fontSize: '25px',
    margin: '0 0 30px 0'
  },
  footer: {
    container: {
      backgroundColor: colors.lightGray,
      textAlign: 'right',
      paddingTop: 20,
      paddingBottom: 20,
      paddingLeft: 30,
      paddingRight: 30
    }
  }
};
