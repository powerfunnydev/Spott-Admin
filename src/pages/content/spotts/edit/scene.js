import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import SelectionArea from '../../../../tagger/components/sceneEditor/selectionArea';

@Radium
export default class Scene extends Component {

  static propTypes = {
    imageUrl: PropTypes.string.isRequired,
    onSelectionRegion: PropTypes.func.isRequired
  };

  static styles = {
    wrapper: {
      display: 'inline-block',
      lineHeight: 0,
      position: 'relative'
    }
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

    console.warn('Point', point);
    console.warn('Region', region);
    this.props.onSelectionRegion(point, region);
  }

  render () {
    const { imageUrl } = this.props;
    const styles = this.constructor.styles;

    return (
      <SelectionArea
        disable={false}
        ref={(c) => { this._wrapper = c && c.component; }}
        style={styles.wrapper}
        onSelection={this.onSelectionRegion}>
        <img src={imageUrl} style={{ width: '100%' }} />
      </SelectionArea>
    );
  }

}
