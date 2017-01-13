/* eslint-disable react/no-set-state */
import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { HotKeys } from 'react-hotkeys';
import NavigationArrow from './images/navigationArrow';
import Cross from './images/cross';

@Radium
export default class LargeImageModal extends Component {

  static propTypes = {
    images: PropTypes.array.isRequired,
    title: PropTypes.string
  };

  constructor (props) {
    super(props);
    this.close = ::this.close;
    this.open = ::this.open;
    this.onClose = ::this.onClose;
    this.onNavigateLeft = ::this.onNavigateLeft;
    this.onNavigateRight = ::this.onNavigateRight;
    this.state = {};
  }

  close () {
    this.setState({ index: null });
  }

  open (index) {
    // Set the index of the image and re-render.
    this.setState({ index });
    // We use setTimeout so the HTML is already rendered, the next tick.
    setTimeout(() => {
      const largeImageModalContent = document.getElementById('largeImageModalContent');
      if (largeImageModalContent) {
        largeImageModalContent.focus();
      }
    });
  }

  onClose (e) {
    e.preventDefault();
    this.close();
  }

  onNavigateLeft (e) {
    e.preventDefault();
    const index = this.state.index || 0;
    if (0 <= index - 1) {
      this.setState({ index: index - 1 });
    }
  }

  onNavigateRight (e) {
    e.preventDefault();
    const index = this.state.index || 0;
    const max = this.props.images.length;
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
      maxHeight: 600,
      maxWidth: '100%'
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
      justifyContent: 'space-between',
      padding: '1.5em',
      minWidth: 850,
      width: '70%'
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
      maxWidth: 700
    }
  };

  render () {
    const index = this.state.index;
    const isOpen = typeof index === 'number';

    if (isOpen) {
      const styles = this.constructor.styles;
      const { images, title } = this.props;
      const imageUrl = images[index];

      const keyMap = {
        close: 'esc',
        navigateLeft: 'left',
        navigateRight: 'right'
      };

      const handlers = {
        close: this.close,
        navigateLeft: this.onNavigateLeft,
        navigateRight: this.onNavigateRight
      };

      return (
        <HotKeys handlers={handlers} keyMap={keyMap} style={styles.overlay} onClick={this.onClose}>
          <div id='largeImageModalContent' style={styles.content} tabIndex='0' onClick={(e) => e.stopPropagation()}>
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
                <img src={`${imageUrl}?height=699&width=1242`} style={styles.image}/>
              </div>
              <button style={[ styles.right, index + 1 === images.length && styles.disabled ]} title='Next image' onClick={this.onNavigateRight}>
                <NavigationArrow color='white' />
              </button>
            </div>
            <div style={styles.paging}>
              {index + 1}/{images.length}
            </div>
          </div>
        </HotKeys>
      );
    }
    return <span />;
  }
}
