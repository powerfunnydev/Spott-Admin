import Radium from 'radium';
import React, { Component, PropTypes } from 'react';
import { MOVIE, EPISODE, COMMERCIAL, TRAILER } from '../../../../constants/mediumTypes';
import { colors } from '../../../_common/styles';

@Radium
class MediaType extends Component {

  static propTypes = {
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
    tab: {
      base: {
        cursor: 'pointer',
        paddingBottom: 12, // 10px for text, 2px for border
        marginRight: 30
      }
    },
    text: {
      active: {
        borderBottom: `2px solid ${colors.secondaryPink}`,
        color: colors.secondaryPink,
        paddingBottom: 10
      },
      base: {
        color: 'rgb(171, 172, 174)',
        fontSize: '16px',
        fontFamily: 'Rubik-Medium'
      }
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { selected, text } = this.props;
    return (
      <button style={styles.tab.base} onClick={this.onClick}>
        <span style={[ styles.text.base, selected && styles.text.active ]}>{text}</span>
      </button>
    );
  }

}

@Radium
export default class MediaTypes extends Component {

  static propTypes = {
    currentMediaType: PropTypes.string.isRequired,
    style: PropTypes.object,
    onMediaTypeClick: PropTypes.func.isRequired
  };

  static styles = {
    mediaTypes: {
      display: 'flex',
      fontSize: '16px',
      textAlign: 'center'
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { currentMediaType, style, onMediaTypeClick } = this.props;

    return (
      <div style={[ style, styles.mediaTypes ]}>
        <MediaType
          selected={currentMediaType === MOVIE}
          text='MOVIE'
          onClick={onMediaTypeClick.bind(this, MOVIE)} />
        <MediaType
          selected={currentMediaType === EPISODE}
          text='EPISODE'
          onClick={onMediaTypeClick.bind(this, EPISODE)} />
        <MediaType
          selected={currentMediaType === COMMERCIAL}
          text='COMMERCIAL'
          onClick={onMediaTypeClick.bind(this, COMMERCIAL)} />
        <MediaType
          selected={currentMediaType === TRAILER}
          text='TRAILER'
          onClick={onMediaTypeClick.bind(this, TRAILER)} />
      </div>
    );
  }

}
