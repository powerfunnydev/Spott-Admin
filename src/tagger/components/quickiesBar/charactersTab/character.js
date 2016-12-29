/* eslint-disable no-return-assign */
/* eslint-disable react/no-set-state */
import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { DragSource } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { CHARACTER_QUICKY } from '../../../constants/itemTypes';

const arrowImage = require('../../_helpers/images/arrow.svg');

const characterSource = {
  beginDrag ({ character }) {
    // This object contains the character id and will be accessible by the scene component in
    // the DragTarget via monitor.getItem().
    return { characterId: character.get('id') };
  }
};

@DragSource(CHARACTER_QUICKY, characterSource, (connector, monitor) => ({
  connectDragPreview: connector.dragPreview(),
  connectDragSource: connector.dragSource(),
  isDragging: monitor.isDragging()
}))
@Radium
export default class Character extends Component {

  static propTypes = {
    character: ImmutablePropTypes.map.isRequired,
    connectDragPreview: PropTypes.func.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onClick = ::this.onClick;
  }

  componentDidMount () {
    // Use empty image as a drag preview so browsers don't draw it
    // and we can draw whatever we want on the custom drag layer instead.
    this.props.connectDragPreview(getEmptyImage(), {
      // IE fallback: specify that we'd rather screenshot the node
      // when it already knows it's being dragged so we can hide it with CSS.
      captureDraggingState: true
    });
  }

  onClick (e) {
    e.preventDefault();
    this.props.onClick();
  }

  static styles = {
    container: {
      backgroundColor: 'rgb(32, 32, 32)',
      color: 'rgba(255, 255, 255, 0.5)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      padding: '5px 20px',
      marginBottom: 1
    },
    arrow: {
      fontSize: '8px'
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
      backgroundSize: 'contain'
    },
    name: {
      fontSize: '0.75em',
      justifyContent: 'space-between',
      paddingLeft: 10,
      paddingRight: 10,
      // Prevent long item names to overflow by wrapping to the next line
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      width: '100%'
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { character, connectDragSource } = this.props;

    return connectDragSource(
      <li style={styles.container} onClick={this.onClick}>
        <div style={[ styles.image, { backgroundImage: `url('${character.get('portraitImageUrl')}?width=95&height=95')` } ]} title={character.get('name')}>&nbsp;</div>
        <div style={styles.name}>{character.get('name')}</div>
        <span style={styles.arrow}>
          <img src={arrowImage} />
        </span>
      </li>
    );
  }
}
