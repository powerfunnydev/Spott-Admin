import React, { Component, PropTypes } from 'react';
import { DropTarget } from 'react-dnd';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Appearance from './appearance';
import MarkerImageTooltip from './markerImageTooltip';
import SelectionArea from './selectionArea';
import ProportionalDiv from '../_helpers/proportionalDiv';
import { CHARACTER_QUICKY, MARKER, PRODUCT_QUICKY } from '../../../constants/itemTypes';
import { PRODUCT } from '../../../constants/appearanceTypes';

const ASPECT_RATIO = 0.5625;

// On a scene we can drop either a marker or a character/product from the quickies bar.
const sceneTarget = {
  drop (props, monitor, component) {
    const itemType = monitor.getItemType();

    switch (itemType) {
      case MARKER: {
        const { x: clientX, y: clientY } = monitor.getDifferenceFromInitialOffset();
        const { height, width } = component._wrapper.getBoundingClientRect();
        return {
          x: Math.round(clientX / width * 100),
          y: Math.round(clientY / height * 100)
        };
      }
      case CHARACTER_QUICKY: {
        const { x, y } = monitor.getClientOffset();
        const { height, left, top, width } = component._wrapper.getBoundingClientRect();
        const point = {
          x: Math.round((x - left) / width * 100),
          y: Math.round((y - top) / height * 100)
        };
        const { characterId } = monitor.getItem();
        props.onDropCharacter({ characterId, point });
        break;
      }
      case PRODUCT_QUICKY: {
        const { x, y } = monitor.getClientOffset();
        const { height, left, top, width } = component._wrapper.getBoundingClientRect();
        const point = {
          x: Math.round((x - left) / width * 100),
          y: Math.round((y - top) / height * 100)
        };
        const { characterId, markerHidden, productId, relevance } = monitor.getItem();
        props.onDropProduct({ characterId, markerHidden, point, productId, relevance });
        break;
      }
    }
  }
};

@DropTarget([ CHARACTER_QUICKY, MARKER, PRODUCT_QUICKY ], sceneTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget()
}))
export default class Scene extends Component {

  static propTypes = {
    appearances: ImmutablePropTypes.list.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    // The URL of the image of the current scene.
    currentSceneImageUrl: PropTypes.string,
    hoveredAppearanceTuple: ImmutablePropTypes.map,
    selectedAppearance: PropTypes.string,
    // Override the inline-styles of the root element.
    style: PropTypes.object,
    onCopyAppearance: PropTypes.func.isRequired,
    onDropCharacter: PropTypes.func.isRequired,
    onDropProduct: PropTypes.func.isRequired,
    onEditAppearance: PropTypes.func.isRequired,
    onHoverAppearance: PropTypes.func.isRequired,
    onLeaveAppearance: PropTypes.func.isRequired,
    onMoveAppearance: PropTypes.func.isRequired,
    // Function for requesting to open the "What are you tagging" dialog?
    onOpenWhatToTag: PropTypes.func.isRequired,
    onRemoveAppearance: PropTypes.func.isRequired,
    onSelectAppearance: PropTypes.func.isRequired,
    onToggleSelectAppearance: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onSelectionRegion = ::this.onSelectionRegion;
  }

  onSelectionRegion (selection) {
    // The Element.getBoundingClientRect() method returns the size of an element and its position relative to the viewport.
    // Get mouse position relative to the canvas for .x & .y
    const { height, left, top, width } = this._wrapper.getBoundingClientRect();

    const region = {
      x: Math.round((selection.x - left) / width * 100),
      y: Math.round((selection.y - top) / height * 100),
      width: Math.round(selection.width / width * 100),
      height: Math.round(selection.height / height * 100)
    };

    // Use the center of the selected region as marker position.
    const point = {
      x: Math.round(region.x + (region.width / 2)),
      y: Math.round(region.y + (region.height / 2))
    };

    this.props.onOpenWhatToTag(point, region);
  }

  static styles = {
    container: {
      position: 'relative',
      // Fill the available width
      width: '100%',
      // The style is applied to a ProportionalDiv. This div automatically sets
      // a CSS height in function of the width according to the speciified
      // aspect ratio. However, here we force the actual size to never exceed 350px.
      maxHeight: 350
    },
    outerWrapper: {
      height: '100%',
      textAlign: 'center'
    },
    wrapper: {
      height: '100%',
      position: 'relative',
      display: 'inline-block'
    },
    image: {
      // Make the image as large as possible
      height: '100%',
      maxWidth: '100%',
      width: 'auto'
    },
    layover: {
      position: 'absolute',
      bottom: 0,
      top: 0,
      left: 0,
      right: 0,
      overflow: 'hidden'
    }
  };

  // When no point is defined in the appearance, we use point { x: 0, y: 0 } as default.
  renderTooltip (hoveredAppearanceTuple) {
    if (hoveredAppearanceTuple) {
      const point = hoveredAppearanceTuple.getIn([ 'appearance', 'point' ]);

      return (
        <MarkerImageTooltip
          imageUrl={hoveredAppearanceTuple.getIn([ 'entity', 'imageUrl' ]) || hoveredAppearanceTuple.getIn([ 'entity', 'portraitImageUrl' ])}
          relativeLeft={(point && point.get('x')) || 0}
          relativeTop={(point && point.get('y')) || 0} />
      );
    }
  }

  render () {
    const { styles } = this.constructor;
    const { appearances, connectDropTarget, currentSceneImageUrl, hoveredAppearanceTuple, selectedAppearance, onCopyAppearance, onEditAppearance, onHoverAppearance, onLeaveAppearance, onMoveAppearance, onRemoveAppearance, onSelectAppearance, onToggleSelectAppearance } = this.props;

    return (
      <ProportionalDiv aspectRatio={ASPECT_RATIO} style={styles.container}>
        {currentSceneImageUrl && connectDropTarget(
          <div style={styles.outerWrapper} onHover={this.onHover} onLeave={this.onLeave}>
              {/* If an appearance is hovered we disable the region of interest selection. */}
              <SelectionArea
                disable={Boolean(hoveredAppearanceTuple)}
                ref={(c) => { this._wrapper = c && c.component; }}
                style={styles.wrapper}
                onSelection={this.onSelectionRegion}>

                <img src={`${currentSceneImageUrl}?width=750&height=422`} style={styles.image}/>

                {this.renderTooltip(hoveredAppearanceTuple)}

                <div style={styles.layover}>
                  {appearances.map((appearance) => {
                    const appearanceType = appearance.get('type');
                    const point = appearance.get('point');
                    const region = appearance.get('region');
                    const appearanceId = appearance.get('appearanceId');
                    const hidden = appearance.get('markerHidden');
                    const hovered = Boolean(hoveredAppearanceTuple) && hoveredAppearanceTuple.get('appearance') === appearance;
                    const onEdit = appearanceType === PRODUCT
                      ? onEditAppearance.bind(this, appearanceId)
                      : () => console.warn('Editing a character is not yet implemented.');
                    return (
                      <Appearance
                        appearanceId={appearanceId}
                        appearanceType={appearanceType}
                        hidden={hidden}
                        hovered={hovered}
                        key={appearanceId}
                        point={point}
                        region={region}
                        selected={appearanceId === selectedAppearance}
                        onCopy={onCopyAppearance}
                        onEdit={onEdit}
                        onHover={onHoverAppearance.bind(this, appearanceId)}
                        onLeave={onLeaveAppearance.bind(this, appearanceId)}
                        onMove={onMoveAppearance.bind(this, appearanceId)}
                        onRemove={onRemoveAppearance.bind(this, appearanceType, appearanceId)}
                        onSelect={onSelectAppearance.bind(this, appearanceId)}
                        onToggleSelect={onToggleSelectAppearance.bind(this, appearanceId)} />
                    );
                  })}
                </div>
              </SelectionArea>

          </div>)}

      </ProportionalDiv>
    );
  }

}
