import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { buttonStyles, colors, fontWeights, makeTextStyle } from './styles';
import RemoveButton from './buttons/removeButton';

@Radium
export default class EntityDetails extends Component {
  static propTypes = {
    content: PropTypes.string,
    image: PropTypes.string,
    style: PropTypes.object,
    subtitle: PropTypes.string,
    title: PropTypes.string.isRequired,
    onEdit: PropTypes.func,
    onRemove: PropTypes.func
  }

  static styles = {
    root: {
      display: 'flex',
      flexDirection: 'row',
      paddingTop: '20px',
      paddingBottom: '20px',
      width: '100%'
    },
    noImage: {
      backgroundColor: colors.lightGray,
      height: '80px',
      width: '143px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    title: {
      paddingBottom: '4px',
      color: colors.black2,
      ...makeTextStyle(fontWeights.medium, '18px', '0.5px')
    },
    subtitle: {
      paddingBottom: '9px',
      ...makeTextStyle(fontWeights.regular, '12px', '0.5px')
    },
    content: {
      maxWidth: '443px',
      lineHeight: '15px',
      color: colors.darkGray2,
      ...makeTextStyle(fontWeights.regular, '12px', '0.5px')
    },
    alignRight: {
      marginLeft: 'auto'
    }
  }

  render () {
    const { content, image, title, subtitle, onEdit, onRemove } = this.props;
    const { styles } = this.constructor;
    return (
      <div style={styles.root}>
        {(image && <img src={image} style={{ height: '80px' }}/>) || <div style={styles.noImage}>No image</div>}
        <div style={{ paddingLeft: '20px' }}>
          <div style={styles.title}>{title}</div>
          <div style={styles.subtitle}>{subtitle}</div>
          <div style={styles.content}>{content}</div>
        </div>
        <div style={styles.alignRight}>
          {onEdit && <button style={[ buttonStyles.base, buttonStyles.small, buttonStyles.white ]} onClick={onEdit}>Edit</button>}
          {onRemove && <RemoveButton style={[ buttonStyles.base, buttonStyles.small, buttonStyles.white, { minWidth: '30px' } ]} onClick={onRemove}/>}
        </div>
      </div>
    );
  }
}
