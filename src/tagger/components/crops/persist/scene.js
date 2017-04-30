/* eslint-disable react/no-set-state */
import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import Radium from 'radium';
import ReactCrop from 'react-image-crop';
import ImmutablePropTypes from 'react-immutable-proptypes';
import MarkerImageTooltip from '../../sceneEditor/markerImageTooltip';
import { MarkerContainer } from '../../sceneEditor/marker';
import 'react-image-crop/dist/ReactCrop.css';

@Radium
export default class Scene extends Component {

  static propTypes = {
    appearances: ImmutablePropTypes.list.isRequired,
    imageUrl: PropTypes.string.isRequired,
    region: PropTypes.object,
    onSelectionRegion: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.state = { hoveredAppearanceTuple: null };
  }

  static styles = {
    container: {
      position: 'relative'
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
      pointerEvents: 'none'
    }
  }

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
    const styles = this.constructor.styles;
    const { appearances, imageUrl, region, onSelectionRegion } = this.props;

    const noop = (c) => c;

    return (
      <div style={styles.container}>
        <ReactCrop crop={region} src={imageUrl} onComplete={({ height, width, x, y }) => onSelectionRegion({ height, width, x, y })}/>
        {this.renderTooltip(this.state.hoveredAppearanceTuple)}
        <div style={styles.layover}>
          {appearances.map((appearanceTuple) => {
            const appearance = appearanceTuple.get('appearance');
            const appearanceType = appearance.get('type');
            const point = appearance.get('point');
            const appearanceId = appearance.get('appearanceId');
            const hidden = appearance.get('markerHidden');
            const hovered = this.state.hoveredAppearanceTuple === appearanceTuple;
            return (
              <MarkerContainer
                appearanceId={appearanceId}
                appearanceType={appearanceType}
                connectDragSource={noop}
                hidden={hidden}
                hovered={hovered}
                isDragging={false}
                key={appearanceId}
                relativeLeft={point && point.get('x')}
                relativeTop={point && point.get('y')}
                selected={false}
                onCopy={noop}
                onEdit={noop}
                onHover={() => this.setState({ hoveredAppearanceTuple: appearanceTuple })}
                onLeave={() => this.setState({ hoveredAppearanceTuple: null })}
                onMove={noop} // onMoveAppearance.bind(this, appearanceId)}
                onRemove={noop}
                onSelect={noop} // onSelectAppearance.bind(this, appearanceId)}
                onToggleSelect={noop}/> // onToggleSelectAppearance.bind(this, appearanceId)} />
            );
          })}
        </div>
      </div>
    );
  }

}
