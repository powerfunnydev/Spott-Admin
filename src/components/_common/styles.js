export const colors = {
  primaryBlue: 'rgb(31, 188, 233)',
  primaryBlue2: 'rgb(57, 214, 255)',
  secondaryPink: 'rgb(211, 23, 81)',
  secondaryPink2: 'rgb(237, 49, 107)',
  black: 'rgb(14, 27, 32)',
  darkerGray: 'rgb(135, 141, 143)',
  darkGray: 'rgb(186, 189, 192)',
  lightGray: 'rgb(241, 243, 244)',
  errorColor: 'rgb(236, 65, 15)'
};

const hoveredBlueButtonStyle = {
  backgroundColor: colors.primaryBlue2,
  border: `1px solid ${colors.primaryBlue2}`
};
const hoveredPinkButtonStyle = {
  backgroundColor: colors.secondaryPink2,
  border: `1px solid ${colors.secondaryPink2}`
};
const hoveredBorderedButtonStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.20)',
  border: '1px solid rgb(250, 250, 250)'
};
const hoveredGrayButtonStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.65)',
  border: '1px solid rgb(191, 196, 199)'
};

export const buttonStyles = {
  base: {
    borderRadius: 4,
    color: 'white',
    display: 'inline-block',
    fontFamily: 'Rubik-Regular',
    fontSize: '14px',
    marginLeft: 14,
    paddingTop: 8,
    paddingBottom: 8,
    textAlign: 'center',
    textDecoration: 'none',
    transition: 'background-color 200ms linear, border-color 200ms linear',
    width: 100
  },
  // Button sizes
  small: {
    fontSize: '13px',
    paddingBottom: 6,
    paddingTop: 6,
    minWidth: 70
  },
  extraSmall: {
    fontSize: '13px',
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 10,
    paddingRight: 10,
    width: 'auto'
  },
  large: {
    fontSize: '18px',
    paddingBottom: 12,
    paddingTop: 12,
    minWidth: 170
  },
  // Button flavors
  blue: {
    backgroundColor: colors.primaryBlue,
    border: `1px solid ${colors.primaryBlue}`, // To ensure size is equal with "bordered" buttons.
    ':hover': hoveredBlueButtonStyle,
    ':focus': hoveredBlueButtonStyle
  },
  pink: {
    backgroundColor: colors.secondaryPink,
    border: `1px solid ${colors.secondaryPink}`, // To ensure size is equal with "bordered" buttons.
    ':hover': hoveredPinkButtonStyle,
    ':focus': hoveredPinkButtonStyle
  },
  bordered: {
    backgroundColor: 'transparent',
    border: '1px solid rgb(232, 232, 232)',
    ':hover': hoveredBorderedButtonStyle,
    ':focus': hoveredBorderedButtonStyle
  },
  gray: {
    border: '1px solid rgb(196, 200, 203)',
    color: 'rgb(157, 163, 164)',
    ':hover': hoveredGrayButtonStyle,
    ':focus': hoveredGrayButtonStyle
  },
  // Disable left margin for the first button
  first: {
    marginLeft: 0
  }
};

export const errorTextStyle = {
  color: colors.errorColor,
  paddingTop: 3,
  fontSize: '11px'
};
