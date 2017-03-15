import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { colors, fontWeights, makeTextStyle } from '../../_common/styles';
import Spinner from '../../_common/components/spinner';

@Radium
export default class ListWidget extends Component {

  static propTypes = {
    children: PropTypes.node,
    header: PropTypes.node,
    isLoading: PropTypes.bool,
    style: PropTypes.object,
    title: PropTypes.string
  };

  static styles = {
    container: {
      backgroundColor: 'white',
      borderRadius: 2,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: colors.lightGray3,
      paddingTop: '1.8em',
      paddingBottom: '1.5em',
      paddingLeft: '1.5em',
      paddingRight: '1.5em'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      minHeight: '2em',
      marginBottom: '1em'
    },
    title: {
      ...makeTextStyle(fontWeights.medium, '0.688em', '0.0455em'),
      color: colors.veryDarkGray,
      textTransform: 'uppercase',
      paddingRight: 24
    },
    widget: {
      width: '100%'
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { children, header, isLoading, style, title } = this.props;
    return (
      <div style={[ styles.widget, style ]}>
        <div style={styles.container}>
          {title &&
            <div style={styles.header}>
              <h2 style={styles.title}>{title}&nbsp;&nbsp;&nbsp;</h2>
              {isLoading && <Spinner size='small' />}
              {header}
            </div>}
          {children}
        </div>
      </div>
    );
  }
}
