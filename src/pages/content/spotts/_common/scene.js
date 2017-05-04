/* eslint-disable react/no-set-state */
import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { DropTarget } from 'react-dnd';
import ImageDropzone from '../../../_common/dropzone/imageDropzone';
import SelectionArea from '../../../../tagger/components/sceneEditor/selectionArea';
import MarkerImageTooltip from '../../../../tagger/components/sceneEditor/markerImageTooltip';
import { errorTextStyle } from '../../../_common/styles';
import Tag from './tag';

const sceneTarget = {
  drop (props, monitor, component) {
    console.warn('DROP');
    const itemType = monitor.getItemType();

    switch (itemType) {
      case 'TAG': {
        const { x: clientX, y: clientY } = monitor.getDifferenceFromInitialOffset();
        const { height, width } = component._wrapper.getBoundingClientRect();
        return {
          x: Math.round(clientX / width * 100),
          y: Math.round(clientY / height * 100)
        };
      }
    }
  }
};

@DropTarget([ 'TAG' ], sceneTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget()
}))
@Radium
export default class Scene extends Component {

  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    imageUrl: PropTypes.string,
    meta: PropTypes.object,
    tags: PropTypes.array,
    onChangeImage: PropTypes.func.isRequired,
    onEditTag: PropTypes.func.isRequired,
    onMoveTag: PropTypes.func.isRequired,
    onRemoveTag: PropTypes.func.isRequired,
    onSelectionRegion: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onSelectionRegion = ::this.onSelectionRegion;
    this.state = { hoveredTag: null, localeImage: null };
  }

  onSelectionRegion (selection) {
    console.warn('testtt');
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

    console.warn('Point', point);
    console.warn('Region', region);
    this.props.onSelectionRegion(point, region);
  }

  static styles = {
    container: {
      // alignItems: 'center',
      // display: 'flex',
      // flexDirection: 'column',
      // justifyContent: 'center'
    },
    wrapper: {
      display: 'inline-block',
      lineHeight: 0,
      marginBottom: '1em',
      position: 'relative'
    },
    layover: {
      position: 'absolute',
      bottom: 0,
      top: 0,
      left: 0,
      right: 0,
      overflow: 'hidden',
      userDrag: 'none',
      userSelect: 'none',
      zIndex: 2
    }
  }

  renderTooltip (tag) {
    if (tag) {
      console.warn('TAG', tag);
      let image;
      switch (tag.entityType) {
        case 'CHARACTER':
          image = tag.character.portraitImage;
          break;
        case 'PERSON':
          image = tag.person.portraitImage;
          break;
        case 'PRODUCT':
          image = tag.product.logo;
          break;
      }

      if (image) {
        return (
          <MarkerImageTooltip
            imageUrl={image.url}
            relativeLeft={tag.point.x}
            relativeTop={tag.point.y} />
        );
      }
    }
  }

  render () {
    const { connectDropTarget, imageUrl, meta, tags, onChangeImage, onEditTag, onMoveTag, onRemoveTag } = this.props;
    const { localeImage } = this.state;
    const styles = this.constructor.styles;

    const noop = (c) => c;
    return (
      <div style={styles.container}>
        {(imageUrl || localeImage) &&
          <SelectionArea
            disable={Boolean(this.state.hoveredTag)}
            ref={(c) => { this._wrapper = c && c.component; }}
            style={styles.wrapper}
            onSelection={this.onSelectionRegion}>
            <img draggable={false} src={localeImage ? localeImage.preview : imageUrl} style={{ pointerEvents: 'none', userDrag: 'none', userSelect: 'none', width: '100%' }} />
            {this.renderTooltip(this.state.hoveredTag)}
            {connectDropTarget(
              <div style={styles.layover}>
                {tags && tags.map((tag) => {
                  const { entityType, point, id } = tag;
                  return (
                    <Tag
                      appearanceId={id}
                      appearanceType={entityType}
                      hovered={false}
                      key={id}
                      relativeLeft={point.x}
                      relativeTop={point.y}
                      selected={false}
                      onCopy={noop}
                      onEdit={onEditTag.bind(null, id)}
                      onHover={() => this.setState({ hoveredTag: tag })}
                      onLeave={() => this.setState({ hoveredTag: null })}
                      onMove={onMoveTag.bind(null, id)}
                      onRemove={onRemoveTag.bind(null, id)}
                      onSelect={noop}
                      onToggleSelect={noop}/>
                  );
                })}
            </div>)}
        </SelectionArea>}
        <ImageDropzone
          accept='image/*'
          downloadUrl={imageUrl}
          height={100}
          imageUrl={imageUrl}
          onChange={({ callback, file }) => {
            this.setState({ localeImage: file });
            onChangeImage(file);
            // Fake the progress...
            callback(1, 1);
          }}
          onDelete={() => {
            this.setState({ localeImage: null });
            onChangeImage(null);
          }}/>
          {meta && meta.touched && meta.error && <div style={errorTextStyle}>{meta.error}</div>}
      </div>
    );
  }

}
