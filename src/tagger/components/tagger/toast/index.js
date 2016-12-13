import Radium from 'radium';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import * as toastActions from '../../../actions/toast';
import toastSelector from '../../../selectors/toast';

const iconImage = require('./icon.svg');

@connect(toastSelector, (dispatch) => ({
  popToast: bindActionCreators(toastActions.pop, dispatch)
}))
@Radium
export default class Toast extends Component {

  static propTypes = {
    currentToast: ImmutablePropTypes.map,
    popToast: PropTypes.func.isRequired
  };

  componentDidUpdate () {
    // We received a new toast, let's timeout
    if (this.props.currentToast) {
      setTimeout(() => {
        this.props.popToast();
      }, 3000);
    }
  }

  static styles = {
    container: {
      display: 'flex',
      width: 320,
      position: 'fixed',
      right: 20,
      top: 40,
      minHeight: 60, // Matches the flex-basis in icon.base style
      zIndex: 2
    },
    icon: {
      base: {
        // Positioning
        flex: '0 0 60px',
        // Child positioning
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // Styling
        borderRadius: '5px 0px 0px 5px'
      },
      error: {
        backgroundColor: 'rgb(236, 65, 15)',
        border: '1px solid rgb(236, 65, 15)'
      },
      info: {
        backgroundColor: 'rgb(0, 115, 211)',
        border: '1px solid rgb(0, 115, 211)'
      },
      warning: {
        backgroundColor: 'rgb(248, 170, 15)',
        border: '1px solid rgb(248, 170, 15)'
      }
    },
    iconImage: {
      width: 26
    },
    text: {
      base: {
        // Positioning
        flex: '1 0',
        // Styling
        fontFamily: 'Rubik-Regular',
        backgroundColor: '#fff',
        borderRadius: '0px 5px 5px 0px',
        // Child positioning
        display: 'relative',
        padding: 17
      },
      error: {
        color: 'rgb(236, 65, 15)',
        border: '1px solid rgb(236, 65, 15)'
      },
      info: {
        color: 'rgb(0, 115, 211)',
        border: '1px solid rgb(0, 115, 211)'
      },
      warning: {
        color: 'rgb(248, 170, 15)',
        border: '1px solid rgb(248, 170, 15)'
      }
    }
  };

  render () {
    const { styles } = this.constructor;
    const { currentToast } = this.props;

    // Render empty if there is no toast to show
    if (!currentToast) {
      return (
        <div></div>
      );
    }
    // Visualize the toast
    // TODO: design showed a 'cross' to close it. This may be implemented later.
    const type = currentToast.get('type');
    const text = currentToast.get('text');
    return (
      <div style={styles.container}>
        <div style={[ styles.icon.base, styles.icon[type] ]}><img src={iconImage} style={styles.iconImage} /></div>
        <div style={[ styles.text.base, styles.text[type] ]}>
          {text}
        </div>
      </div>
    );
  }

}
