import React, { Component, PropTypes } from 'react';
import Radium from 'radium';

import { colors, fontWeights, makeTextStyle, mediaQueries } from '../_common/styles';
import Spinner from '../_common/components/spinner';

class Demographic extends Component {

  static styles = {
    container: {
      display: 'flex'
    },
    audience: {
      ...makeTextStyle(fontWeights.regular, '0.813em', 0.2),
      color: colors.darkGray3,
      marginTop: '3em'
    },
    audienceCount: {
      ...makeTextStyle(fontWeights.regular, '0.875em', 0.5),
      color: colors.black2
    },
    audienceLabel: {
      ...makeTextStyle(fontWeights.regular, '0.75em', 0.5),
      color: colors.lightGray3
    },
    left: {
      backgroundColor: colors.lightGray4,
      border: `solid 1px ${colors.lightGray2}`,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      textAlign: 'center',
      width: 235,
      padding: 19
    },
    right: {
      width: '100%'
    },
    header: {
      ...makeTextStyle(fontWeights.regular, '0.688em', 0.5),
      alignItems: 'center',
      backgroundColor: colors.veryLightGray,
      border: `solid 1px ${colors.lightGray2}`,
      borderRadius: 2,
      color: colors.darkGray2,
      display: 'flex',
      textTransform: 'uppercase',
      width: '100%',
      height: 33,
      paddingLeft: 24
    }
  };

  render () {
    const styles = this.constructor.styles;
    return (
      <div style={styles.container}>
        <div style={styles.left}>
          <div style={styles.audience}>0 to 18 Years, Dutch, Male</div>
          <div style={styles.audienceCount}>1868</div>
          <div style={styles.audienceLabel}>Users in this demographic</div>
        </div>
        <div styles={styles.right}>
          <div>
            <div style={styles.header}>Demographic insight</div>
            <div>
              <div />
            </div>
          </div>
          <div>
            <div style={styles.header}>Interaction with your brand</div>
          </div>
        </div>
      </div>
    );
  }
}

@Radium
export default class DemographicsWidget extends Component {

  static propTypes = {
    children: PropTypes.node,
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
    wrapper: {
      position: 'relative',
      width: '100%'
    },
    content: {

    },
    header: {
      display: 'flex',
      alignItems: 'center',
      height: '2em',
      marginBottom: '1em'
    },
    title: {
      ...makeTextStyle(fontWeights.medium, '0.688em', '0.0455em'),
      color: colors.veryDarkGray,
      textTransform: 'uppercase'
    },
    widget: {
      width: '100%'
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { children, isLoading, style, title } = this.props;
    return (
      <div style={[ styles.widget, style ]}>
        <div style={styles.container}>
          <div style={styles.wrapper}>
            <div style={styles.header}>
              <h2 style={styles.title}>{title}&nbsp;&nbsp;&nbsp;</h2>
              {isLoading && <Spinner size='small' />}
            </div>
            {children}
            <Demographic />
          </div>
        </div>
      </div>
    );
  }
}
