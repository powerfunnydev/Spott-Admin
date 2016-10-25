import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { buttonStyles, colors, fontWeights, makeTextStyle } from './styles';
import RemoveButton from './buttons/removeButton';

@Radium
export default class EntityDetails extends Component {
  static propTypes = {
    image: PropTypes.string,
    style: PropTypes.object,
    subtitle: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    onEdit: PropTypes.func,
    onRemove: PropTypes.func
  }

  render () {
    const { image, title, subtitle, onEdit, onRemove } = this.props;
    return (
      <div style={{ display: 'flex', flexDirection: 'row', paddingTop: '20px', paddingBottom: '20px', width: '100%' }}>
        {image && <img src={image} style={{ height: '80px' }}/> || <div style={{ height: '80px' }}>No image</div>}
        <div style={{ paddingLeft: '20px' }}>
          <div style={{ paddingBottom: '4px', color: colors.black2, ...makeTextStyle(fontWeights.medium, '18px', '0.5px') }}>{title}</div>
          <div style={{ paddingBottom: '9px', ...makeTextStyle(fontWeights.regular, '12px', '0.5px') }}>{subtitle}</div>
          <div style={{ maxWidth: '443px', lineHeight: '15px', color: colors.darkGray2, ...makeTextStyle(fontWeights.regular, '12px', '0.5px') }}>This is the base language summary for this specific episode, no longer
then 2 lines, if the text too long to fit in this are it gets cut of by 3 dots…</div>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          {onEdit && <button style={[ buttonStyles.base, buttonStyles.small, buttonStyles.white ]} onEdit={onEdit}>Edit</button>}
          {onRemove && <RemoveButton style={[ buttonStyles.base, buttonStyles.small, buttonStyles.white, { minWidth: '30px' } ]} onRemove={onRemove}/>}
        </div>
      </div>
    );
  }
}
