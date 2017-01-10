import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import NavigationArrow from './images/navigationArrow';
import Cross from './images/cross';
import { colors } from './styles';

@Radium
export default class LargeImageModal extends Component {

  static propTypes = {
    images: PropTypes.array.isRequired
  };

  constructor (props) {
    super(props);
    this.onClose = ::this.onClose;
    this.onNavigateLeft = ::this.onNavigateLeft;
    this.onNavigateRight = ::this.onNavigateRight;
    this.open = ::this.open;
    this.close = ::this.close;
    this.state = {};
  }

  close () {
    this.setState({ index: null });
  }
  open (index) {
    this.setState({ index });
  }

  onClose (e) {
    e.preventDefault();
    this.close();
  }

  onNavigateLeft (e) {
    e.preventDefault();
    const index = this.state.index || 0;
    console.warn('onNavigateLeft', index);
    if (0 <= index - 1) {
      this.setState({ index: index - 1 });
    }
  }

  onNavigateRight (e) {
    e.preventDefault();
    const index = this.state.index || 0;
    const max = this.props.images.length;
    console.warn('onNavigateRight', index, max);
    if (index + 1 < max) {
      this.setState({ index: index + 1 });
    }
  }

  static styles = {
    overlay: {
      backgroundColor: 'rgba(28, 28, 28, 0.9)',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1000
    },
    content: {
      position: 'absolute',
      WebkitOverflowScrolling: 'touch',
      outline: 'none',
      top: '50%',
      left: '50%',
      right: 'auto',
      // Fit height to content, centering vertically
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      textAlign: 'center'
    },
    close: {
    },
    image: {
      maxHeight: 500,
      maxWidth: 600
    },
    paging: {
      fontFamily: 'Rubik-Medium',
      color: 'white',
      fontSize: '0.75em',
      display: 'inline-block'
    },
    imageContainer: {
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'center',
      padding: '1.5em'
    },
    left: {
      paddingRight: '1.25em'
    },
    right: {
      paddingLeft: '1.25em'
    },
    arrowLeft: {
      transform: 'rotate(180deg)'
    },
    header: {
      alignItems: 'center',
      backgroundColor: 'black',
      color: 'white',
      display: 'flex',
      fontSize: '1.125em',
      height: '3.125em',
      justifyContent: 'space-between',
      paddingLeft: '1.5em',
      paddingRight: '1.5em'
    },
    disabled: {
      opacity: 0.5
    },
    middleContainer: {
      display: 'flex',
      flexDirection: 'column',
      maxWidth: 700,
      maxHeight: 600
    }
  };

  render () {
    const index = this.state.index;
    const isOpen = typeof index === 'number';

    if (isOpen) {
      const styles = this.constructor.styles;
      const { images, title } = this.props;
      const imageUrl = images[index];

      return (
        <div style={styles.overlay} onClick={this.onClose}>
          <div style={styles.content} onClick={(e) => e.stopPropagation()}>
            <div style={styles.imageContainer}>
              <button style={[ styles.left, index === 0 && styles.disabled ]} title='Previous image' onClick={this.onNavigateLeft}>
                <NavigationArrow color='white' style={styles.arrowLeft}/>
              </button>
              <div style={styles.middleContainer}>
                <div style={styles.header}>
                  {title}
                  <button style={styles.close} title='Close' onClick={this.onClose}>
                    <Cross color='white'/>
                  </button>
                </div>
                <div>
                  <img src={`${imageUrl}?height=699&width=1242`} style={styles.image}/>
                </div>
              </div>
              <button style={[ styles.right, index + 1 === images.length && styles.disabled ]} title='Next image' onClick={this.onNavigateRight}>
                <NavigationArrow color='white' />
              </button>
            </div>
            <div style={styles.paging}>
              {index + 1}/{images.length}
            </div>
          </div>
        </div>
      );
    }
    return <span />;
  }
}
