import React, { Component, PropTypes } from 'react';
import Radium from 'radium';

import { colors, fontWeights, makeTextStyle, mediaQueries } from '../_common/styles';
import Spinner from '../_common/components/spinner';

@Radium
export default class MapWidget extends Component {

  static propTypes = {
    children: PropTypes.node,
    isLoading: PropTypes.bool,
    style: PropTypes.object,
    title: PropTypes.string
  };

  constructor (props) {
    super(props);

    const markers = [];

    for (let i = 0; i < 10000; i++) {
      markers.push({
        label: `${Math.round(Math.random() * 100)}`,
        position: { lat: 50.3 + Math.random() * 2, lng: 4 + Math.random() * 2 }
      });
    }

    this.state = {
      markers
    };
  }

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
      position: 'relative'
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
      width: '100%',
      marginBottom: '1.75em',
      paddingLeft: '0.75em',
      paddingRight: '0.75em',
      [mediaQueries.large]: {
        display: 'inline-block',
        width: '50%'
      }
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
          </div>
        </div>
      </div>
    );
  }
}
