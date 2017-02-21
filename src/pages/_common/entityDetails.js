import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { buttonStyles, colors, fontWeights, makeTextStyle } from './styles';
import RemoveButton from './components/buttons/removeButton';

@Radium
export default class EntityDetails extends Component {

  static propTypes = {
    content: PropTypes.node,
    imageUrl: PropTypes.string,
    style: PropTypes.object,
    subtitle: PropTypes.string,
    title: PropTypes.string.isRequired,
    titleBadge: PropTypes.any,
    onEdit: PropTypes.func,
    onRemove: PropTypes.func
  };

  static styles = {
    root: {
      display: 'flex',
      flexDirection: 'row',
      paddingTop: '20px',
      paddingBottom: '20px',
      width: '100%'
    },
    noImage: {
      ...makeTextStyle(fontWeights.regular, '11px', '0.4px'),
      color: colors.lightGray3,
      height: '80px',
      width: '143px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: '2px',
      border: `solid 1px ${colors.veryLightGray}`
    },
    image: {
      borderRadius: '2px',
      height: '80px',
      objectFit: 'scale-down',
      width: '143px'
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
      marginLeft: 'auto',
      minWidth: '130px'
    },
    paddingLeft: {
      paddingLeft: '20px'
    },
    minWidth: {
      minWidth: '30px'
    },
    regular: {
      ...makeTextStyle(fontWeights.regular, '12px')
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { content, imageUrl, title, subtitle, onEdit, onRemove, titleBadge } = this.props;
    return (
      <div style={styles.root}>
        {imageUrl
          ? <img src={imageUrl} style={styles.image} />
          : <div style={styles.noImage}>No image</div>}
        <div style={styles.paddingLeft}>
          <div style={styles.title}>{title}{titleBadge}</div>
          <div style={styles.subtitle}>{subtitle}</div>
          <div style={styles.content}>{content}</div>
        </div>
        <div style={styles.alignRight}>
          {onEdit && <button style={[ buttonStyles.base, buttonStyles.small, buttonStyles.white, styles.regular ]} onClick={onEdit}>Edit</button>}
          {onRemove && <RemoveButton style={[ buttonStyles.base, buttonStyles.small, buttonStyles.white, styles.minWidth ]} onClick={onRemove}/>}
        </div>
      </div>
    );
  }
}
