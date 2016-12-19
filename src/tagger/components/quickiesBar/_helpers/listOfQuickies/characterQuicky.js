import Radium from 'radium';
import React, { Component, PropTypes } from 'react';
import { DragSource } from 'react-dnd';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { ContextMenuLayer } from 'react-contextmenu';
import { quickyStyle } from './styles';
import { CHARACTER_QUICKY } from '../../../../constants/itemTypes';

const characterQuickySource = {
  beginDrag ({ quicky }) {
    // This object contains the character id and will be accessible by the scene component in
    // the DragTarget via monitor.getItem().
    return { characterId: quicky.get('characterId') };
  }
};

@ContextMenuLayer('quickiesBar-quicky', (props) => {
  return {
    onRemove: props.onRemove
  };
})
@DragSource(CHARACTER_QUICKY, characterQuickySource, (connector, monitor) => ({
  connectDragSource: connector.dragSource(),
  isDragging: monitor.isDragging()
}))
@Radium
export default class CharacterQuicky extends Component {

  static propTypes = {
    character: ImmutablePropTypes.map,
    // Call this function inside render() to let React DnD handle the drag events.
    connectDragSource: PropTypes.func.isRequired,
    quicky: ImmutablePropTypes.map.isRequired,
    onRemove: PropTypes.func.isRequired
  };

  shouldComponentUpdate (newProps) {
    const { character, quicky } = this.props;
    return character !== newProps.character || quicky !== newProps.quicky;
  }

  static styles = {
    character: {
      borderRadius: '100%'
    }
  };

  render () {
    const { styles } = this.constructor;
    const { character, connectDragSource } = this.props;

    return (
      connectDragSource(
        <div
          style={[ quickyStyle, styles.character, character && { backgroundImage: `url('${character.get('portraitImageUrl')}?width=95&height=95')` } ]}
          title={character && character.get('name')} />
      )
    );
  }

}
