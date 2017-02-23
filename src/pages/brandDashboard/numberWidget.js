import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { colors, fontWeights, makeTextStyle, Container } from '../_common/styles';

@Radium
export default class NumberWidget extends Component {

  static propTypes = {
    children: PropTypes.node.isRequired,
    title: PropTypes.string.isRequired
  };

  static styles = {
    container: {
      backgroundColor: '#fff',
      border: `solid 1px ${colors.lightGray2}`,
      borderRadius: 4,
      paddingBottom: '0.625em',
      paddingLeft: '0.625em',
      paddingRight: '0.625em',
      paddingTop: '0.625em'
    },
    content: {
      ...makeTextStyle(fontWeights.medium, 0.7),
      color: colors.darkGray3,
      fontSize: '1.5em',
      textAlign: 'center',
      marginBottom: '0.25em'
    },
    title: {
      ...makeTextStyle(fontWeights.regular, 0.5),
      color: colors.lightGray3,
      fontSize: '0.75em',
      textAlign: 'center'
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { children, style, title } = this.props;
    return (
      <div style={[ styles.container, style ]}>
        <div style={styles.content}>{children}</div>
        <div style={styles.title}>{title}</div>
      </div>
    );
  }
}
