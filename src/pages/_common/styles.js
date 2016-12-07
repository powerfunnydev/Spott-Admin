import React, { Component, PropTypes } from 'react';
import Radium from 'radium';

export const colors = {
  white: '#ffffff',
  primaryBlue: '#09bbf0',
  primaryBlue2: '#39D6FF',
  blue: '#08a7d7',
  blue2: '#0795c0',
  blue3: '#9de4f9',
  lightBlue: '#e6f8fd',
  secondaryPink: '#D31751',
  secondaryPink2: '#ED316B',
  red: '#da5454',
  lightRed: '#f0bbbb',
  veryLightRed: '#fbeeee',
  lightGreen: '#aacc6b',
  darkYellow: '#cca644',
  lightYellow: '#fffaee',
  black: '#121e22',
  black2: '#0d1b20',
  darkerGray: '#878D8F',
  darkGray: '#BABDC0',
  darkGray2: '#6d8791',
  darkGray3: '#536970',
  veryDarkGray: '#17262b',
  veryLightGray: '#eaeced',
  lightGray: '#F1F3F4',
  lightGray2: '#ced6da',
  lightGray3: '#aab5b8',
  lightGray4: '#f4f5f5',
  lightGray5: '#d8d8d8',
  errorColor: '#e17575'
};

export const defaultSpacing = 15;

export const tabStyles = {
  tabList: {
    marginBottom: 0,
    borderWidth: 0
  },
  tab: {
    fontSize: '12px',
    color: '#536970',
    borderColor: colors.lightGray3
  }
};

const hoveredBlueButtonStyle = {
  backgroundColor: colors.blue,
  border: `1px solid ${colors.blue}`
};
const focusedBlueButtonStyle = {
  backgroundColor: colors.blue2,
  border: `1px solid ${colors.blue2}`
};
const hoveredPinkButtonStyle = {
  backgroundColor: colors.secondaryPink2,
  border: `1px solid ${colors.secondaryPink2}`
};
const hoveredBorderedButtonStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.20)',
  border: '1px solid rgb(250, 250, 250)'
};
const hoveredWhiteButtonStyle = {
  color: colors.darkGray3,
  backgroundColor: colors.white,
  border: `solid 1px ${colors.lightGray3}`
};
const focusedWhiteButtonStyle = {
  color: colors.darkGray3,
  backgroundColor: colors.lightGray4,
  border: `solid 1px ${colors.lightGray3}`
};
const hoveredGrayButtonStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.65)',
  border: '1px solid rgb(191, 196, 199)'
};

export const errorTextStyle = {
  color: colors.errorColor,
  paddingTop: 3,
  fontSize: '11px'
};

export const fontWeights = {
  light: 'Rubik-Light',
  regular: 'Rubik-Regular',
  medium: 'Rubik-Medium',
  bold: 'Rubik-Bold'
};

export const mediaQueryThresholds = {
  extraSmall: 0,
  small: 480,
  medium: 768,
  large: 992,
  extraLarge: 1200
};
export const mediaQueries = {
  small: `@media only screen and (min-width: ${mediaQueryThresholds.small}px)`,
  medium: `@media only screen and (min-width: ${mediaQueryThresholds.medium}px)`,
  large: `@media only screen and (min-width: ${mediaQueryThresholds.large}px)`,
  extraLarge: `@media only screen and (min-width: ${mediaQueryThresholds.extraLarge}px)`
};
export function makeTextStyle (fontWeight = fontWeights.regular, fontSize = '1em', letterSpacing = 0, lineHeight = 'normal') {
  return {
    fontFamily: fontWeight,
    fontSize,
    letterSpacing,
    lineHeight
  };
}

export const buttonStyles = {
  base: {
    borderRadius: '2px',
    color: 'white',
    display: 'inline-block',
    ...makeTextStyle(fontWeights.regular, '14px'),
    marginLeft: '10px',
    paddingTop: '8px',
    paddingBottom: '8px',
    textAlign: 'center',
    textDecoration: 'none',
    transition: 'background-color 200ms linear, border-color 200ms linear',
    minWidth: '100px'
  },
  // Button sizes
  small: {
    ...makeTextStyle(fontWeights.medium, '12px'),
    paddingTop: '8px',
    paddingBottom: '8px',
    paddingLeft: '13px',
    paddingRight: '13px',
    width: 'auto',
    minWidth: '70px'
  },
  extraSmall: {
    fontSize: '13px',
    paddingTop: '4px',
    paddingBottom: '4px',
    paddingLeft: '10px',
    paddingRight: '10px',
    width: 'auto'
  },
  large: {
    fontSize: '18px',
    paddingBottom: '12px',
    paddingTop: '12px',
    minWidth: '170px'
  },
  // Button flavors
  blue: {
    backgroundColor: colors.primaryBlue,
    border: `1px solid ${colors.primaryBlue}`, // To ensure size is equal with "bordered" buttons.
    ':hover': hoveredBlueButtonStyle,
    ':focus': focusedBlueButtonStyle
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
  white: {
    backgroundColor: colors.white,
    border: '1px solid #ced6da',
    color: '#6d8791',
    ':hover': hoveredWhiteButtonStyle,
    ':focus': focusedWhiteButtonStyle
  },
  // Disable left margin for the first button
  first: {
    marginLeft: 0
  }
};

const formSubtitleStyle = {
  ...makeTextStyle(fontWeights.medium, '0.75em'),
  color: colors.black,
  marginTop: '30px',
  fontWeight: 500
};

export const FormSubtitle = Radium((props) => (
  <h2 style={[ formSubtitleStyle, props.style, props.first && { marginTop: '0px' } ]}>
    {props.children}
  </h2>
));
FormSubtitle.propTypes = {
  children: PropTypes.node,
  first: PropTypes.bool,
  style: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ])
};

const formDescriptionStyle = {
  ...makeTextStyle(fontWeights.regular, '0.75em'),
  color: colors.lightGray3,
  marginTop: '0.313em'
};
export const FormDescription = Radium((props) => (
  <p style={[ formDescriptionStyle, props.style, props.first && { marginTop: '0px' } ]}>
    {props.children}
  </p>
));

// Container component
// ///////////////////
/* const containerStyles = {
  marginLeft: 'auto',
  marginRight: 'auto',
  width: '100%',
  paddingLeft: '0.9375em',
  paddingRight: '0.9375em',
  [mediaQueries.medium]: {
    paddingLeft: 0,
    paddingRight: 0,
    width: 738
  },
  [mediaQueries.large]: {
    width: 962
  },
  [mediaQueries.extraLarge]: {
    width: 1170
  }
};*/

// Container component
// ///////////////////
const containerStyles = {
  width: '100%',
  paddingLeft: '40px',
  paddingRight: '40px'
};
export const Container = Radium((props) => (
  <div {...props} style={[ containerStyles, props.style ]}>
    {props.children}
  </div>
));
Container.propTypes = {
  children: PropTypes.node,
  style: PropTypes.object
};

// Container component
// ///////////////////

const rootStyles = {
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: '100%'
};
export const Root = Radium((props) => (
  <div {...props} style={[ rootStyles, props.style ]}>
    {props.children}
  </div>
));
Container.propTypes = {
  children: PropTypes.node
};

@Radium
export class EditTemplate extends Component {

  static propTypes = {
    children: PropTypes.node,
    disableSubmit: PropTypes.bool,
    style: PropTypes.object,
    onCancel: PropTypes.func,
    onSubmit: PropTypes.func
  };

  constructor (props) {
    super(props);
  }

  static styles = {
    cancelAndSubmitComponent: {
      borderBottomLeftRadius: '2px',
      borderBottomRightRadius: '2px',
      paddingBottom: '10px',
      paddingTop: '10px',
      paddingRight: '22.5px',
      display: 'flex',
      justifyContent: 'flex-end',
      borderBottom: `1px solid ${colors.lightGray3}`,
      borderLeft: `1px solid ${colors.lightGray3}`,
      borderRight: `1px solid ${colors.lightGray3}`,
      backgroundColor: colors.veryLightGray,
      width: '100%'
    },
    container: {
      marginTop: '1.3em'
    },
    disabled: {
      backgroundColor: colors.primaryBlue,
      border: `solid 1px ${colors.primaryBlue}`,
      opacity: 0.4
    }
  };

  render () {
    const { styles } = this.constructor;
    const { children, disableSubmit, style, onCancel, onSubmit } = this.props;

    return (
      <Container style={[ styles.container, style ]}>
        {children}
        {(onCancel || onSubmit) && <div style={styles.cancelAndSubmitComponent}>
          {onCancel &&
            <button
              key='cancel'
              style={[ buttonStyles.base, buttonStyles.small, buttonStyles.white ]}
              onClick={onCancel}>Cancel</button>}
          {onSubmit &&
            <button
              disabled={disableSubmit}
              key='save'
              style={[ buttonStyles.base, buttonStyles.small, buttonStyles.blue, disableSubmit && styles.disabled ]}
              onClick={onSubmit}>Save</button>}
        </div>}
      </Container>
    );
  }

}
