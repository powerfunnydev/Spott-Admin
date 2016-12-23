import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import ImmutablePropTypes from 'react-immutable-proptypes';
import colors from '../colors';

const starFilledImage = require('./images/starFilled.svg');

@Radium
export default class SceneGroup extends Component {

  static propTypes = {
    // The scene group number, to create a default label.
    number: PropTypes.number.isRequired,
    sceneGroup: ImmutablePropTypes.map.isRequired,
    selected: PropTypes.bool.isRequired,
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
        marginBottom: 1,
        paddingBottom: '0.55em',
        paddingLeft: '0.65em',
        paddingRight: '0.65em',
        paddingTop: '0.55em',
        width: '100%'
      },
      selected: {
        backgroundColor: colors.black4,
        borderLeft: `4px solid ${colors.strongBlue}`
      }
    },
    name: {
      display: 'flex',
      flex: '1 1',
      fontSize: '0.75em',
      justifyContent: 'space-between',
      // Prevent long item names to overflow by wrapping to the next line
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
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
    const { number, sceneGroup, selected } = this.props;

    return (
      <li style={[ styles.container.base, selected && styles.container.selected ]} onClick={this.onClick}>
        <div style={styles.name}>{sceneGroup.get('label') || `Scene ${number}`}</div>
        {sceneGroup.get('keySceneId')
          ? <div style={[ styles.badge.base, styles.badge.star ]}><img src={starFilledImage} style={styles.starImage} />1</div>
          : <div style={[ styles.badge.base, styles.badge.none ]}>0</div>}
      </li>
    );
  }
}
