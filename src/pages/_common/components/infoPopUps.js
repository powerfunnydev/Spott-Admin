import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { colors, fontWeights } from '../../_common/styles';

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
    message: PropTypes.string.isRequired,
    stackTrace: PropTypes.string,
    style: PropTypes.object
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
      color: colors.errorColor
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
    const { message, stackTrace, style, color } = this.props;

    return (
      <div>
        {!this.state.close && <div style={[ generalStyles.container, color === 'blue' && styles.blue,
                                color === 'yellow' && styles.yellow,
                                color === 'red' && styles.red, style ]}>
            <div style={[ generalStyles.horizontal ]}>
              <div>
                <span style={styles.medium}>{message}</span>
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
    message: PropTypes.string.isRequired,
    style: PropTypes.object
  }

  render () {
    const { message, style } = this.props;

    return (
      <StandardComponent color='blue' message={message} style={style}/>
    );
  }
}

@Radium
export class InfoComponent extends Component {
  static propTypes = {
    message: PropTypes.string.isRequired,
    style: PropTypes.object
  }

  render () {
    const { message, style } = this.props;

    return (
      <StandardComponent color='yellow' message={message} style={style}/>
    );
  }
}

@Radium
export class ErrorComponent extends Component {
  static propTypes = {
    message: PropTypes.string.isRequired,
    stackTrace: PropTypes.string,
    style: PropTypes.object
  }

  render () {
    const { message, stackTrace, style } = this.props;

    return (
      <StandardComponent color='red' message={message} stackTrace={stackTrace} style={style}/>
    );
  }
}
