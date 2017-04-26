import React, { Component, PropTypes } from 'react';

export default class ImageTitle extends Component {

  static propTypes = {
    imageUrl: PropTypes.string,
    title: PropTypes.string
  };

  static styles = {
    container: {
      paddingRight: 10,
      display: 'inline-flex'
    },
    image: {
      borderRadius: 2,
      height: 29,
      objectFit: 'contain',
      width: 29
    },
    imagePlaceholder: {
      paddingRight: 39
    },
    title: {
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap'
    },
    wrapper: {
      alignItems: 'center',
      display: 'inline-flex',
      width: '100%'
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { imageUrl, title } = this.props;
    return (
      <div style={styles.wrapper}>
        {(imageUrl &&
          <div style={styles.container}>
            <img src={`${imageUrl}?height=150&width=150`} style={styles.image} />
          </div>) || <div style={styles.imagePlaceholder}/>}
        <div style={styles.title} title={title}>{title}</div>
      </div>
    );
  }

}
