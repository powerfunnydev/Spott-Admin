/* eslint-disable react/no-set-state */
import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link } from 'react-router';
import Modal from '../../../../../_common/components/persistModal';
import { makeTextStyle, fontWeights, colors, buttonStyles } from '../../../../../_common/styles';
import * as actions from './actions';
import selector from './selector';
import Spinner from '../../../../../_common/components/spinner';
import PlusButton from '../../../../../_common/components/buttons/plusButton';
import DollarSVG from '../../../../../_common/images/dollar';
import ToolTip from '../../../../../_common/components/toolTip';
import { HotKeys } from 'react-hotkeys';

const map = {
  leftPressed: 'left',
  rightPressed: 'right',
  upPressed: 'up',
  downPressed: 'down'
};

const dialogStyle = {
  overlay: {
    display: 'flex',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.80)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  content: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'relative',
    backgroundColor: 'transparent',
    border: 'none',
    fontFamily: 'Rubik-Regular',
    fontWeight: 'normal',
    width: '100%',
    // Set width and center horizontally
    minWidth: 928,
    maxWidth: 928,
    // Internal padding
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '100%',
    overflow: 'auto'
  }
};
@connect(selector, (dispatch) => ({
  fetchSuggestedProducts: bindActionCreators(actions.fetchSuggestedProducts, dispatch)
}))
@Radium
export default class ImageCompareModal extends Component {

  static propTypes = {
    currencies: ImmutablePropTypes.map.isRequired,
    fetchSuggestedProducts: PropTypes.func.isRequired,
    imageHasSuggestedProducts: ImmutablePropTypes.map, // Contains all suggested productIds
    images: PropTypes.array, // Array of image objects (contains url and id)
    productId: PropTypes.string.isRequired,
    products: ImmutablePropTypes.map,
    onClickAddSimilarProduct: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.state = {};
    this.selectProduct = ::this.selectProduct;
    this.selectSuggestedProduct = ::this.selectSuggestedProduct;
    this.renderSuggestedProducts = ::this.renderSuggestedProducts;
    this.leftPressed = ::this.leftPressed;
    this.rightPressed = ::this.rightPressed;
    this.upPressed = ::this.upPressed;
    this.downPressed = ::this.downPressed;
  }

  componentWillMount () {
    this.selectProduct(0);
  }

  async selectProduct (index) {
    const { images } = this.props;
    this.setState({ ...this.state, selectedProductIndex: index });
    const image = images[index];
    if (image) {
      await this.props.fetchSuggestedProducts({ imageId: image.id });
      this.selectSuggestedProduct(0, true);
      setTimeout(() => { document.getElementById('similarProductsContainer').focus(); });
    }
  }

  async selectSuggestedProduct (suggestedProductIndex, otherProductSelected) {
    const { selectedSuggestedProductIndex } = this.state;
    if (suggestedProductIndex !== selectedSuggestedProductIndex || otherProductSelected) {
      this.setState({ ...this.state, selectedSuggestedProductIndex: suggestedProductIndex, isOpen: true });
    } else {
      this.setState({ ...this.state, selectedSuggestedProductIndex: suggestedProductIndex, isOpen: !this.state.isOpen });
    }
    const img = document.getElementById(`suggestedImage${suggestedProductIndex}`);
    const information = document.getElementById(`information${suggestedProductIndex}`);
    if (img && img.scrollIntoViewIfNeeded) {
      img.scrollIntoViewIfNeeded();
    }
    if (information && information.scrollIntoViewIfNeeded) {
      information.scrollIntoViewIfNeeded();
    }
  }

  upPressed () {
    const selectedSuggestedProductIndex = this.state.selectedSuggestedProductIndex;
    if (selectedSuggestedProductIndex - 4 >= 0) {
      this.selectSuggestedProduct(selectedSuggestedProductIndex - 4);
    } else if (selectedSuggestedProductIndex > 0) {
      this.selectSuggestedProduct(0);
    }
  }

  downPressed () {
    const selectedSuggestedProductIndex = this.state.selectedSuggestedProductIndex;
    const { images, imageHasSuggestedProducts } = this.props;
    const selectedProductIndex = this.state.selectedProductIndex;
    const selectedProductImage = images && images[selectedProductIndex];
    const suggestedProducts = imageHasSuggestedProducts && imageHasSuggestedProducts.getIn([ selectedProductImage.id ]);
    if (suggestedProducts && suggestedProducts.get('data').size - 1 >= selectedSuggestedProductIndex + 4) {
      this.selectSuggestedProduct(selectedSuggestedProductIndex + 4);
    } else if (suggestedProducts && suggestedProducts.get('data').size - 1 > selectedSuggestedProductIndex) {
      this.selectSuggestedProduct(suggestedProducts.get('data').size - 1);
    }
  }

  leftPressed () {
    const selectedSuggestedProductIndex = this.state.selectedSuggestedProductIndex;
    if (selectedSuggestedProductIndex > 0) {
      this.selectSuggestedProduct(selectedSuggestedProductIndex - 1);
    }
  }

  rightPressed () {
    const selectedSuggestedProductIndex = this.state.selectedSuggestedProductIndex;
    const { images, imageHasSuggestedProducts } = this.props;
    const selectedProductIndex = this.state.selectedProductIndex;
    const selectedProductImage = images && images[selectedProductIndex];
    const suggestedProducts = imageHasSuggestedProducts && imageHasSuggestedProducts.getIn([ selectedProductImage.id ]);
    if (suggestedProducts && suggestedProducts.get('data').size - 1 > selectedSuggestedProductIndex) {
      this.selectSuggestedProduct(selectedSuggestedProductIndex + 1);
    }
  }

  static styles = {
    content: {
      display: 'flex',
      width: '100%'
    },
    spinnerContainer: {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    spinner: {
      width: 40,
      height: 40
    },
    productsContainer: {
      backgroundColor: colors.lightGray4,
      borderRight: `solid 1px ${colors.lightGray2}`,
      padding: 24,
      display: 'flex',
      flexDirection: 'column'
    },
    selectedProduct: {
      backgroundColor: colors.white,
      width: 262,
      height: 262,
      border: `solid 1px ${colors.lightGray2}`
    },
    selectedProductImg: {
      width: 260,
      height: 260,
      objectFit: 'scale-down'
    },
    similarProductsContainer: {
      maxHeight: '550px',
      overflow: 'scroll',
      width: '100%',
      backgroundColor: colors.white,
      padding: 24,
      outline: 0
    },
    smallProductsContainer: {
      maxWidth: 270,
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginLeft: -4,
      marginRight: -4,
      paddingTop: 10
    },
    smallProduct: {
      margin: 4,
      backgroundColor: colors.white,
      width: 46,
      height: 46,
      border: `solid 1px ${colors.lightGray2}`,
      cursor: 'pointer'
    },
    smallProductImg: {
      width: 44,
      height: 44,
      objectFit: 'scale-down'
    },
    selectedSuggestedProduct: {
      backgroundColor: colors.white,
      width: 122,
      height: 122,
      border: `solid 1px ${colors.lightGray2}`,
      margin: 12,
      cursor: 'pointer'
    },
    selectedSuggestedProductImg: {
      width: 120,
      height: 120,
      objectFit: 'scale-down'
    },
    row: {
      display: 'flex',
      flexDirection: 'row',
      marginLeft: -12,
      marginRight: -12
    },
    rowsContainer: {
      display: 'inline-flex',
      flexDirection: 'column',
      marginTop: -12,
      marginBottom: -12
    },
    informationContainer: {
      width: '100%',
      borderRadius: '2px',
      backgroundColor: colors.lightGray4,
      border: `solid 1px ${colors.lightGray2}`
    },
    informationContent: {
      fontSize: '12px',
      padding: 24
    },
    title: {
      color: colors.black,
      ...makeTextStyle(fontWeights.medium, '12px')
    },
    addSimilarProductBar: {
      backgroundColor: colors.veryLightGray,
      paddingTop: 10,
      paddingBottom: 10,
      paddingRight: 14,
      borderTop: `solid 1px ${colors.lightGray2}`,
      textAlign: 'right'
    },
    tableHeader: {
      paddingTop: '5px',
      paddingRight: '20px',
      color: colors.lightGray3
    },
    offeringContainer: {
      fontSize: '12px',
      lineHeight: '20px',
      display: 'flex',
      alignItems: 'center'
    },
    offeringPaddingRight: {
      paddingRight: '5px'
    },
    link: {
      color: colors.veryDarkGray,
      textDecoration: 'underline',
      cursor: 'pointer',
      paddingRight: '3px'
    },
    information: {
      color: colors.darkGray2
    },
    dollarSvg: {
      display: 'inline-flex',
      alignItems: 'center',
      paddingRight: '4px'
    },
    paddingRow: {
      paddingTop: '5px'
    }
  };

  renderInformationOfSuggestedProduct (product) {
    const { styles } = this.constructor;
    const { currencies } = this.props;
    const offeringsArray = product.get('offerings').toArray() || [];
    const offerings = offeringsArray.map((offering, i) => {
      return (
        <div id={`offering${i}`} key={`offering${i}`} style={[ styles.offeringContainer, ((i + 1) !== offeringsArray.length) && styles.offeringPaddingRight ]}>
          {offering.get('affiliateCode') && <div style={styles.dollarSvg}><DollarSVG/></div>}
          <Link
            style={styles.link}
            to={`/content/shops/read/${offering.getIn([ 'shop', 'id' ])}`}>
              {offering.getIn([ 'shop', 'name' ])}
          </Link>
          <span style={styles.information}>
            ({offering.getIn([ 'price', 'amount' ])}{currencies.getIn([ offering.getIn([ 'price', 'currency' ]), 'symbol' ])})
            {((i + 1) !== offeringsArray.length) && <span>,</span>}
          </span>
        </div>
      );
    });
    return (
      <div id={`information${this.state.selectedSuggestedProductIndex}`} key={product.getIn([ 'fullName', product.get('defaultLocale') ])} style={styles.informationContainer}>
        <div style={styles.informationContent}>
          <div style={styles.title}>Product information</div>
          <table>
            <tbody>
              <tr>
                <td style={styles.tableHeader}>Visual Match</td>
                <td style={styles.information}>{Math.round(product.get('accuracy') * 10000) / 100}%</td>
              </tr>
              <tr>
                <td style={styles.tableHeader}>Name</td>
                <td>
                  <Link style={styles.link} to={`/content/products/read/${product.get('id')}`}>
                    {product.getIn([ 'fullName', product.get('defaultLocale') ])}
                  </Link>
                </td>
              </tr>
              <tr>
                <td style={styles.tableHeader}>Brand</td>
                <td>
                  <Link style={styles.link} to={`/content/brands/read/${product.getIn([ 'brand', 'id' ])}`}>
                    {product.getIn([ 'brand', 'name' ])}
                  </Link>
                </td>
              </tr>
              <tr>
                <td style={styles.tableHeader}>Offerings</td>
                <td style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>{offerings}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style={styles.addSimilarProductBar}>
          <PlusButton
            style={[ buttonStyles.base, buttonStyles.small, buttonStyles.blue ]}
            text='Add as similar'
            onClick={(e) => { e.preventDefault(); this.props.onClickAddSimilarProduct(product.get('id')); }}/>
        </div>
      </div>
    );
  }

  // This method will render all suggested products, details of selected suggested product inclusive.
  renderSuggestedProducts (suggestedProducts) {
    const { styles } = this.constructor;
    const { products } = this.props;
    const selectedSuggestedProductIndex = this.state.selectedSuggestedProductIndex;
    const rows = []; // Contains all the rows
    let row;
    suggestedProducts.get('data').map((productId, index) => {
      // Every time we start a new row, assign a new array.
      if ((index % 4) === 0) {
        row = [];
      }
      // Push a suggested product on the row.
      row.push(
        <ToolTip
          key={`toolTip${index}`}
          mouseEnterDelay={0.3}
          overlay={<img src={`${products.getIn([ productId, 'logo', products.getIn([ productId, 'defaultLocale' ]), 'url' ])}?height=400&width=400`}/>}
          placement='right'
          prefixCls='no-arrow'>
            <div
              id={`suggestedImage${index}`}
              key={`suggestedImage${index}`}
              style={[ styles.selectedSuggestedProduct, this.state.isOpen && index === selectedSuggestedProductIndex && { border: `solid 1px ${colors.primaryBlue}` } ]}
              onClick={() => { this.selectSuggestedProduct(index); }}>
              <img
                src={`${products.getIn([ productId, 'logo', products.getIn([ productId, 'defaultLocale' ]), 'url' ])}?height=400&width=400`}
                style={styles.selectedSuggestedProductImg}/>
          </div>
      </ToolTip>);
      // If we are on the limit of our row, in this case is that on the 4th product,
      // we'll push our row on the rows array.
      if (index % 4 === 3) {
        rows.push(<div key={`rowOfSuggestedImage${index}`} style={styles.row}>{row}</div>);
        // Do a check if we need to show the information of the selected suggestedProduct.
        if (index - 3 <= selectedSuggestedProductIndex && selectedSuggestedProductIndex <= index) {
          this.state.isOpen && rows.push(this.renderInformationOfSuggestedProduct(products.get(suggestedProducts.getIn([ 'data', selectedSuggestedProductIndex ]))));
        }
      } else
      // When we are on the last row of the array of suggestedProducts, we need to push the so far
      // builded row on the rows array.
      if (index === (suggestedProducts.get('data').size - 1)) {
        rows.push(<div key={`rowOfSuggestedImage${index}`} style={styles.row}>{row}</div>);
        // Do a check if we need to show the information of the selected suggestedProduct.
        if (index - (index % 4) <= selectedSuggestedProductIndex && selectedSuggestedProductIndex <= index) {
          this.state.isOpen && rows.push(this.renderInformationOfSuggestedProduct(products.get(suggestedProducts.getIn([ 'data', selectedSuggestedProductIndex ]))));
        }
      }
    });
    return <div style={styles.rowsContainer}>{rows}</div>;
  }

  render () {
    const styles = this.constructor.styles;
    const { images, imageHasSuggestedProducts } = this.props;
    const selectedProductIndex = this.state.selectedProductIndex;
    const selectedProductImage = images && images[selectedProductIndex];
    const suggestedProducts = imageHasSuggestedProducts && imageHasSuggestedProducts.getIn([ selectedProductImage.id ]);
    const handlers = {
      leftPressed: this.leftPressed,
      rightPressed: this.rightPressed,
      upPressed: this.upPressed,
      downPressed: this.downPressed
    };
    return (
      <Modal
        cancelButtonText='Done'
        isOpen
        noContentStyle
        style={dialogStyle}
        title='Image Compare'
        onClose={this.props.onClose}>
        <div style={styles.content}>
          <div style={styles.productsContainer}>
            <div style={styles.selectedProduct}>
              <img src={selectedProductImage && `${selectedProductImage.url}?height=260&width=260`}
                style={styles.selectedProductImg}/>
            </div>
            <div style={styles.smallProductsContainer}>
              {images && images.map((image, index) => (
                <div
                  key={`image${index}`}
                  style={[ styles.smallProduct, index === selectedProductIndex && { border: `solid 1px ${colors.primaryBlue}` } ]}
                  onClick={this.selectProduct.bind(this, index)}>
                  <img src={`${image.url}?height=44&width=44`} style={styles.smallProductImg}/>
                </div>
              ))}
            </div>
          </div>
          <HotKeys handlers={handlers} id='similarProductsContainer' keyMap={map} style={styles.similarProductsContainer}>
              {suggestedProducts && suggestedProducts.get('_status') === 'loaded' &&
                this.renderSuggestedProducts(suggestedProducts) ||
                <div style={styles.spinnerContainer}>
                  <Spinner style={styles.spinner}/>
                </div>
              }
          </HotKeys>
        </div>
      </Modal>
    );
  }
}
