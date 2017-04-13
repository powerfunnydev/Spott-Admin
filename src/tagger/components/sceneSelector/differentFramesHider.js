import Radium from 'radium';
import React, { Component } from 'react';
import * as PropTypes from 'prop-types';

const similarImage = require('./images/similar.svg');

@Radium
export default class DifferentFramesHider extends Component {

  static propTypes = {
    // Information visualized by this component
    isHidden: PropTypes.bool.isRequired,
    // Override the inline-styles of the root element.
    style: PropTypes.object,
    // Actions triggered by this component
    onToggleHidden: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onToggleHidden = ::this.onToggleHidden;
  }

  onToggleHidden (e) {
    e.preventDefault();
    this.props.onToggleHidden();
  }

  static styles = {
    button: {
      base: {
        border: '1px solid #fff',
        borderRadius: 2,
        display: 'flex',
        height: 24,
        justifyContent: 'center',
        width: 24
      },
      hidden: {
        backgroundColor: '#1571d2',
        border: '1px solid #1571d2'
      }
    },
    image: {
      width: 14
    }
  };

  render () {
    const { styles } = this.constructor;
    const { style, isHidden } = this.props;

    return (
      <button style={[ styles.button.base, isHidden && styles.button.hidden, style ]} title={isHidden ? 'Show hidden frames' : 'Hide hidden frames'} onClick={this.onToggleHidden}>
        <img src={similarImage} style={styles.image}/>
      </button>
    );
  }

}
