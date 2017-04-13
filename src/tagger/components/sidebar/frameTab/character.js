import Radium from 'radium';
import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { ContextMenuLayer } from 'react-contextmenu';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ItemStyleDecorator from '../_helpers/itemStyleDecorator';
import DefaultAppearanceBehavior from '../../_helpers/defaultAppearanceBehavior';
import { simpleCompare } from '../../_helpers/utils';

const threeLinesImage = require('../_helpers/images/threeLines.svg');

@ContextMenuLayer('sidebar-character', (props) => {
  return {
    appearanceId: props.appearanceId,
    onCopy: props.onCopy,
    onRemove: props.onRemove
  };
})
@Radium
@ItemStyleDecorator
export default class Character extends Component {

  static propTypes = {
    appearanceId: PropTypes.string.isRequired,
    character: ImmutablePropTypes.map,
    hovered: PropTypes.bool.isRequired,
    sceneCharacter: ImmutablePropTypes.map,
    selected: PropTypes.bool.isRequired,
    style: PropTypes.object,
    onCopy: PropTypes.func.isRequired,
    onHover: PropTypes.func.isRequired,
    onLeave: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    onToggleSelect: PropTypes.func.isRequired
  };

  shouldComponentUpdate (nextProps) {
    return simpleCompare([ 'appearanceId', 'character', 'hovered', 'sceneCharacter', 'selected', 'style' ], this.props, nextProps);
  }

  render () {
    const styles = this.constructor.styles;
    const { character, hovered, selected, onHover, onLeave, onSelect, onToggleSelect } = this.props;
    // Render the character if it has all necessary information.
    if (character && character.get('name')) {
      return (
        <li>
          <DefaultAppearanceBehavior
            style={[ styles.wrapper.base, hovered && styles.wrapper.hovered, selected && styles.wrapper.selected ]}
            onHover={onHover}
            onLeave={onLeave}
            onSelect={onSelect}
            onToggleSelect={onToggleSelect}>
            <div style={[ styles.image, { backgroundImage: `url('${character.get('portraitImageUrl')}?width=95&height=95')` } ]}>&nbsp;</div>
            <div style={styles.text} title={character.get('name')}>{character.get('name')}</div>
            <div style={styles.threeLines}><img src={threeLinesImage} /></div>
          </DefaultAppearanceBehavior>
        </li>
      );
    }

    // Render placeholder character in case the character is not yet successfully fetched.
    // TODO: render something different in case of _status: 'error' or 'fetching'?
    return (
      <li>
        <div
          style={[ styles.wrapper.base, hovered && styles.wrapper.hovered, selected && styles.wrapper.selected ]}
          onHover={onHover}
          onLeave={onLeave}
          onSelect={onSelect}
          onToggleSelect={onToggleSelect}>
          <div style={styles.image}>&nbsp;</div>
          <div style={styles.text}>&nbsp;</div>
          <div style={styles.threeLines}><img src={threeLinesImage} /></div>
        </div>
      </li>
    );
  }

}
