
// Note: get merged with defaults by react-modal
export const dialogStyle = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.45)'
  },
  content: {
    // Set width and center horizontally
    margin: 'auto',
    width: 464,
    // Internal padding
    padding: 0,
    // Fit height to content, centering vertically
    bottom: 'auto',
    top: '50%',
    transform: 'translateY(-50%)'
  }
};

export const colors = {
  gray: 'rgb(187, 190, 193)',
  primaryBlue: 'rgb(0, 115, 211)'
};

export const modalStyle = {
  content: {
    fontFamily: 'Rubik-Regular',
    fontWeight: 'normal',
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 34,
    paddingRight: 34
  },
  error: {
    color: 'rgb(236, 65, 15)',
    fontSize: '13px'
  },
  footer: {
    borderTop: '1px solid rgb(232,232,232)',
    backgroundColor: 'rgb(240,242,243)',
    textAlign: 'right',
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 30,
    paddingRight: 30
  },
  search: {
    paddingBottom: 18
  },
  subtitle: {
    color: 'rgb(160,160,160)',
    fontFamily: 'Rubik-Regular',
    fontWeight: 'normal',
    fontSize: '16px',
    margin: 0,
    paddingBottom: 18,
    paddingTop: 18
  },
  title: {
    color: colors.primaryBlue,
    fontSize: '30px',
    fontWeight: 'normal',
    margin: 0,
    paddingBottom: 10,
    paddingTop: 0
  }
};

export const buttonStyle = {
  base: {
    backgroundColor: 'transparent',
    border: '1px solid rgb(232, 232, 232)',
    borderRadius: 4,
    color: 'rgb(160, 160, 160)',
    fontFamily: 'Rubik-Medium',
    fontSize: '16px',
    padding: '6px 12px 6px 12px',
    minWidth: 122,
    ':hover': {
      backgroundColor: colors.primaryBlue,
      color: 'white'
    },
    ':focus': {
      backgroundColor: colors.primaryBlue,
      color: 'white'
    }
  },
  small: {
    minWidth: 40,
    fontSize: '12px',
    padding: '3px 10px 3px 10px'
  },
  cancel: {
    marginRight: 10
  },
  save: {
    backgroundColor: colors.primaryBlue,
    color: 'white'
  }
};
