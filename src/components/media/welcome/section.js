import Radium from 'radium';
import React, { Component, PropTypes } from 'react';

@Radium
export default class Section extends Component {

  static propTypes = {
    children: PropTypes.node,
    innerStyle: PropTypes.object,
    style: PropTypes.object
  }

  static styles = {
    outer: {
      backgroundColor: '#101b21',
      color: '#fff',
      width: '100%'
    },
    inner: {
      width: '100%',
      marginLeft: 'auto',
      marginRight: 'auto',
      paddingTop: 95,
      paddingBottom: 95,
      '@media only screen and (max-width: 1024px)': {
        paddingLeft: 15,
        paddingRight: 15
      }
    }
  }

  render () {
    const { styles } = this.constructor;
    return (
      <div style={[ styles.outer, this.props.style ]}>
        <div style={[ styles.inner, this.props.innerStyle ]}>
          {this.props.children}
        </div>
      </div>
    );
  }

}
