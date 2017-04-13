import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import Radium from 'radium';
import colors from '../colors';

const starFilledImage = require('../_images/starFilled.svg');

@Radium
export default class ListItem extends Component {

  static propTypes = {
    count: PropTypes.number.isRequired,
    imageUrl: PropTypes.string,
    selected: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onClick = ::this.onClick;
  }

  onClick (e) {
    e.preventDefault();
    this.props.onClick();
  }

  static styles = {
    container: {
      base: {
        alignItems: 'center',
        backgroundColor: colors.black2,
        borderLeft: `4px solid ${colors.black2}`,
        color: colors.warmGray,
        cursor: 'pointer',
        display: 'flex',
        height: '2.5em',
        marginBottom: 1,
        paddingLeft: '0.65em',
        paddingRight: '0.65em',
        width: '100%'
      },
      selected: {
        backgroundColor: colors.black4,
        borderLeft: `4px solid ${colors.strongBlue}`
      }
    },
    image: {
      // Positioning
      flex: '0 0 30px',
      height: 30,
      width: 30,
      // Background properties. The background-image gets injected in JavaScript.
      backgroundColor: 'transparent',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'contain',
      marginRight: 10
    },
    name: {
      fontSize: '0.75em',
      justifyContent: 'space-between',
      paddingRight: 10,
      // Prevent long item names to overflow by wrapping to the next line
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      width: '100%'
    },
    badge: {
      base: {
        display: 'flex',
        alignItems: 'center',
        fontFamily: 'Rubik-Bold',
        fontSize: '0.688em',
        height: '1.6em',
        paddingLeft: '0.6em',
        paddingRight: '0.6em',
        borderRadius: '0.125em'
      },
      star: {
        backgroundColor: colors.vividOrange,
        color: '#fff'
      },
      none: {
        backgroundColor: '#000',
        color: colors.warmGray
      }
    },
    starImage: {
      width: '0.85em',
      marginRight: '0.35em'
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { count, imageUrl, selected, text } = this.props;

    return (
      <li style={[ styles.container.base, selected && styles.container.selected ]} onClick={this.onClick}>
        {imageUrl &&
          <div style={[ styles.image, { backgroundImage: `url('${imageUrl}')` } ]} title={text}>&nbsp;</div>}
        <div style={styles.name}>{text}</div>
        {count > 0
          ? <div style={[ styles.badge.base, styles.badge.star ]}><img src={starFilledImage} style={styles.starImage} />{count}</div>
          : <div style={[ styles.badge.base, styles.badge.none ]}>0</div>}
      </li>
    );
  }
}
