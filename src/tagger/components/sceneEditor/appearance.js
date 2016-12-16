import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Marker from './marker';
import Region from './region';

export default class Appearance extends Component {

  static propTypes = {
    appearanceId: PropTypes.string.isRequired,
    appearanceType: PropTypes.string.isRequired,
    // Hidden markers are shown as dashed lines
    hidden: PropTypes.bool,
    hovered: PropTypes.bool.isRequired,
    point: ImmutablePropTypes.map,
    region: ImmutablePropTypes.map,
    selected: PropTypes.bool.isRequired,
    onCopy: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onHover: PropTypes.func.isRequired,
    onLeave: PropTypes.func.isRequired,
    onMove: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    onToggleSelect: PropTypes.func.isRequired
  };

  render () {
    const { point, region } = this.props;
    let relativeLeft = 0;
    let relativeTop = 0;
    if (point) {
      relativeLeft = point.get('x');
      relativeTop = point.get('y');
    }
    const renderRegion = region && !(region.get('width') === 0 && region.get('height') === 0);

    return (
      <div>
        {renderRegion &&
          <Region height={region.get('height')} width={region.get('width')} x={region.get('x')} y={region.get('y')} />}
        <Marker {...this.props} relativeLeft={relativeLeft} relativeTop={relativeTop} />
      </div>
    );
  }

}
