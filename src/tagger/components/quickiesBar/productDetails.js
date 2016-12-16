/* eslint-disable react/no-set-state */
import Radium from 'radium';
import React, { Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import colors from '../colors';

const arrowImage = require('./images/arrow.svg');

@Radium
export default class ProductDetails extends Component {

  static propTypes = {
    product: ImmutablePropTypes.map
  };

  constructor (props) {
    super(props);
    this.state = { mini: true };
    this.onToggle = ::this.onToggle;
  }

  onToggle (e) {
    e.preventDefault();
    this.setState({ mini: !this.state.mini });
  }

  static styles = {
    arrowContainer: {
      base: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 2,
        height: 24,
        position: 'absolute',
        right: 10,
        top: 10,
        width: 24
      },
      maxi: {
        right: 20,
        top: 20,
        transform: 'scale(1, -1)'
      }
    },
    container: {
      mini: {
        backgroundColor: colors.black1,
        display: 'flex',
        maxHeight: 120
      },
      maxi: {
        backgroundColor: colors.black1,
        maxHeight: 800,
        position: 'relative',
        transition: 'all 0.6s ease-in'
      }
    },
    image: {
      mini: {
        maxHeight: 74,
        maxWidth: 74
      },
      maxi: {
        maxHeight: 367,
        maxWidth: 367
      }
    },
    imageWrapper: {
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'center'
    },
    imageContainer: {
      mini: {
        alignItems: 'center',
        backgroundColor: 'white',
        display: 'flex',
        height: 74,
        justifyContent: 'center',
        width: 74
      },
      maxi: {
        alignItems: 'center',
        backgroundColor: 'white',
        display: 'flex',
        justifyContent: 'center',
        minHeight: 370
      }
    },
    info: {
      color: 'white',
      fontSize: '14px',
      padding: 20,
      width: '100%'
    },
    brandName: {
      fontFamily: 'Rubik-Medium'
    },
    rotateUp: {
      transform: 'rotate(-90deg)'
    }
  };

  render () {
    const { styles } = this.constructor;
    const { product } = this.props;
    const { mini } = this.state;

    if (!(product && product.get('imageUrl'))) {
      return null;
    }

    return (
      <div style={mini ? styles.container.mini : styles.container.maxi}>
        <div style={[ mini && { position: 'relative' } ]}>
          <button style={[ styles.arrowContainer.base, !mini && styles.arrowContainer.maxi ]} onClick={this.onToggle}>
            <img src={arrowImage} style={styles.rotateUp} />
          </button>
          <div style={mini ? styles.imageContainer.mini : styles.imageContainer.maxi}>
            <img
              alt={product.get('shortName')}
              src={`${product.get('imageUrl')}?width=${mini ? 160 : 621}&height=${mini ? 160 : 621}`}
              style={mini ? styles.image.mini : styles.image.maxi}
              title={product.get('shortName')} />
          </div>
        </div>
        <div>
          <div style={styles.info}>
            <div style={styles.brandName}>{product.getIn([ 'brand', 'name' ])}&nbsp;</div>
            <div>{product.get('shortName')}</div>
          </div>
        </div>
      </div>
    );
  }

}
