import Radium from 'radium';
import React, { Component, PropTypes } from 'react';
import { Link as ReactRouterLink } from 'react-router';
import { colors, fontWeights } from '../../_common/styles';

const Link = Radium(ReactRouterLink);
/* eslint-disable react/no-set-state */

const yellowCrossIcon = require('../../../assets/images/cross/cross-yellow.svg');
const blueCrossIcon = require('../../../assets/images/cross/cross-blue.svg');
const redCrossIcon = require('../../../assets/images/cross/cross-red.svg');

const generalStyles = {
  container: {
    width: '100%',
    fontSize: '11px',
    paddingLeft: '24px',
    paddingRight: '24px',
    paddingTop: '13px',
    paddingBottom: '13px'
  },
  close: {
    marginLeft: 'auto',
    cursor: 'pointer'
  },
  horizontal: {
    display: 'flex',
    displayDirection: 'row'
  }
};

@Radium
class StandardComponent extends Component {
  static propTypes = {
    color: PropTypes.string.isRequired,
    link: PropTypes.object,
    message: PropTypes.string.isRequired,
    stackTrace: PropTypes.string,
    style: PropTypes.object,
    onClose: PropTypes.func
  }

  constructor (props) {
    super(props);
    this.onClose = ::this.onClose;
    this.onToggle = ::this.onToggle;
    this.state = { toggleMessage: 'Show more details' };
  }

  onToggle () {
    this.setState({ showStackTrace: !this.state.showStackTrace, toggleMessage: this.state.showStackTrace ? 'Show more details' : 'Show less details' });
  }

  onClose () {
    this.setState({ close: true });
    this.props.onClose && this.props.onClose();
  }

  static styles = {
    blue: {
      color: colors.primaryBlue,
      backgroundColor: colors.lightBlue
    },
    yellow: {
      color: colors.darkYellow,
      backgroundColor: colors.lightYellow
    },
    red: {
      color: colors.red,
      backgroundColor: colors.veryLightRed
    },
    stackTrace: {
      marginTop: '12px',
      padding: '10px',
      borderRadius: '2px',
      backgroundColor: colors.white,
      border: `solid 1px ${colors.lightRed}`,
      fontSize: '11px',
      color: colors.errorColor,
      fontFamily: 'Courier'
    },
    link: {
      fontFamily: fontWeights.light
    },
    medium: {
      fontFamily: fontWeights.medium
    },
    toggle: {
      cursor: 'pointer',
      textDecoration: 'underline',
      marginLeft: '3px'
    }
  }

  render () {
    const { styles } = this.constructor;
    const { message, stackTrace, style, color, link } = this.props;

    return (
      <div>
        {!this.state.close && <div style={[
          generalStyles.container,
          color === 'blue' && styles.blue,
          color === 'yellow' && styles.yellow,
          color === 'red' && styles.red, style
        ]}>
            <div style={[ generalStyles.horizontal ]}>
              <div>
                <span style={styles.medium}>{message}{link &&
                  <Link key='popup' style={[
                    styles.link,
                    color === 'blue' && styles.blue,
                    color === 'yellow' && styles.yellow,
                    color === 'red' && styles.red, style
                  ]}
                    to={link.to}>
                    {link.text}
                  </Link>}
                </span>
                {stackTrace && <span style={styles.toggle} onClick={this.onToggle}>{this.state.toggleMessage}</span> }
              </div>
              {color === 'blue' && <img src={blueCrossIcon} style={generalStyles.close} onClick={this.onClose}/>}
              {color === 'yellow' && <img src={yellowCrossIcon} style={generalStyles.close} onClick={this.onClose}/>}
              {color === 'red' && <img src={redCrossIcon} style={generalStyles.close} onClick={this.onClose}/>}
            </div>
            {stackTrace && this.state.showStackTrace && <div style={styles.stackTrace}>{stackTrace}</div>}
          </div>
        }
      </div>
    );
  }
}

@Radium
export class HintComponent extends Component {
  static propTypes = {
    link: PropTypes.object,
    message: PropTypes.string.isRequired,
    style: PropTypes.object
  }

  render () {
    const { link, message, style } = this.props;

    return (
      <StandardComponent color='blue' link={link} message={message} style={style} {...this.props}/>
    );
  }
}

@Radium
export class InfoComponent extends Component {
  static propTypes = {
    link: PropTypes.object,
    message: PropTypes.string.isRequired,
    style: PropTypes.object
  }

  render () {
    const { link, message, style } = this.props;

    return (
      <StandardComponent color='yellow' link={link} message={message} style={style} {...this.props}/>
    );
  }
}

@Radium
export class ErrorComponent extends Component {
  static propTypes = {
    link: PropTypes.object,
    message: PropTypes.string.isRequired,
    stackTrace: PropTypes.string,
    style: PropTypes.object
  }

  render () {
    const { link, message, stackTrace, style } = this.props;

    return (
      <StandardComponent color='red' link={link} message={message} stackTrace={stackTrace} style={style} {...this.props}/>
    );
  }
}
