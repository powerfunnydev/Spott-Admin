export default {
  image: {
    // Positioning
    flex: '0 0 40px',
    height: 40,
    width: 40,
    // Background properties. The background-image gets injected in JavaScript.
    backgroundColor: 'transparent',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain'
  },
  text: {
    color: 'black',
    flex: '1',
    fontFamily: 'Rubik-Medium',
    fontSize: '14px',
    overflow: 'hidden',
    padding: '0 10px 0 10px',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  textBold: {
    fontFamily: 'Rubik-Medium',
    color: 'rgb(122, 122, 122)'
  },
  textRegular: {
    fontFamily: 'Rubik-Regular',
    color: 'rgb(122, 122, 122)'
  },
  item: {
    base: {
      cursor: 'pointer',
      display: 'flex',
      fontFamily: 'Rubik-Regular',
      fontSize: '14px',
      height: 40,
      borderBottom: '1px solid rgb(229, 229, 229)',
      alignItems: 'center',
      justifyContent: 'center'
    },
    message: {
      backgroundColor: 'rgb(240, 242, 243)',
      borderBottom: 'none',
      cursor: 'default',
      textAlign: 'center',
      color: 'rgb(22, 22, 22)'
    }
  }
};
