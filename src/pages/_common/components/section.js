import Radium from 'radium';
import React, { Component, PropTypes } from 'react';
import { colors } from '../styles';

const defaultSpacing = 15;
@Radium
export default class Section extends Component {

  static propTypes = {
    children: PropTypes.node,
    first: PropTypes.bool,
    style: PropTypes.object,
    title: PropTypes.node
  };

  static styles = {
    container: {
      borderColor: colors.lightGray3,
      borderStyle: 'solid',
      borderWidth: 1,
      backgroundColor: colors.white,
      color: colors.black,
      padding: `${defaultSpacing * 2}px ${defaultSpacing * 1.5}px`,
      marginTop: defaultSpacing
    },
    first: {
      marginTop: 0
    },
    title: {
      fontSize: '26px',
      marginBottom: defaultSpacing * 2
    }
  }

  render () {
    const { styles } = this.constructor;
    const { children, first, style, title } = this.props;
    // Determine items
    return (
      <div style={[ styles.container, first && styles.first, style ]}>
        {title && <h2 style={styles.title}>{title}</h2>}
        {children}
      </div>
    );
  }
}
