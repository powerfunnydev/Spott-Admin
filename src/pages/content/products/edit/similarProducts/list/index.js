/* eslint-disable react/no-set-state */
import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { bindActionCreators } from 'redux';
import Section from '../../../../../_common/components/section';
import { headerStyles, Table, Headers, CustomCel, Rows, Row } from '../../../../../_common/components/table/index';
import { buttonStyles, colors, fontWeights, makeTextStyle, FormSubtitle, FormDescription } from '../../../../../_common/styles';
import RemoveButton from '../../../../../_common/components/buttons/removeButton';
import { routerPushWithReturnTo } from '../../../../../../actions/global';
import selector from './selector';
import * as actions from './actions';
import Autosuggest from '../../../../../_common/inputs/autoSuggest';
import { slowdown } from '../../../../../../utils';
import { FETCHING } from '../../../../../../constants/statusTypes';
import PlusSVG from '../../../../../_common/images/plus';
import ToolTip from '../../../../../_common/components/toolTip';
import QuestionSVG from '../../../../../_common/images/question';
import DollarSVG from '../../../../../_common/images/dollar';
import ImageCompareModal from '../imageCompare';

@connect(selector, (dispatch) => ({
  deleteSimilarProduct: bindActionCreators(actions.deleteSimilarProduct, dispatch),
  loadSimilarProducts: bindActionCreators(actions.loadSimilarProducts, dispatch),
  persistSimilarProduct: bindActionCreators(actions.persistSimilarProduct, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch),
  searchProducts: bindActionCreators(actions.searchProducts, dispatch)
}))
@Radium
export default class SimilarProducts extends Component {

  static propTypes = {
    currencies: ImmutablePropTypes.map.isRequired,
    deleteSimilarProduct: PropTypes.func.isRequired,
    images: PropTypes.array,
    loadSimilarProducts: PropTypes.func.isRequired,
    persistSimilarProduct: PropTypes.func.isRequired,
    productId: PropTypes.string.isRequired,
    productsById: ImmutablePropTypes.map.isRequired,
    routerPushWithReturnTo: PropTypes.func.isRequired,
    searchProducts: PropTypes.func.isRequired,
    searchedProductIds: ImmutablePropTypes.map.isRequired,
    similarProducts: ImmutablePropTypes.map.isRequired
  };

  constructor (props) {
    super(props);
    this.state = { openImageCompareModal: false };
    this.closeImageCompareModal = ::this.closeImageCompareModal;
    this.openImageCompareModal = ::this.openImageCompareModal;
    this.onClickAddSimilarProduct = ::this.onClickAddSimilarProduct;
    this.slowSearchProducts = slowdown(props.searchProducts, 300);
  }

  componentWillMount () {
    const { loadSimilarProducts, productId } = this.props;
    loadSimilarProducts({ productId });
  }

  closeImageCompareModal () {
    this.setState({ openImageCompareModal: false });
  }

  openImageCompareModal () {
    this.setState({ openImageCompareModal: true });
  }

  async onClickDeleteSimilarProduct (similarProductId) {
    const { deleteSimilarProduct, loadSimilarProducts, productId } = this.props;
    await deleteSimilarProduct({ similarProductId });
    await loadSimilarProducts({ productId });
  }

  async onClickAddSimilarProduct (productId) {
    const { loadSimilarProducts, persistSimilarProduct } = this.props;
    const currentProductId = this.props.productId;
    await persistSimilarProduct({ product1Id: currentProductId, product2Id: productId });
    await loadSimilarProducts({ productId: currentProductId });
  }

  static styles = {
    description: {
      marginBottom: '1.25em'
    },
    adaptedCustomCel: {
      fontSize: '11px',
      paddingTop: '4px',
      paddingBottom: '4px',
      minHeight: '30px'
    },
    adaptedRows: {
      minHeight: '3.75em'
    },
    customTable: {
      border: `1px solid ${colors.lightGray2}`
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
    offeringShop: {
      color: colors.veryDarkGray,
      textDecoration: 'underline',
      cursor: 'pointer',
      paddingRight: '3px'
    },
    offeringPrice: {
      color: colors.darkGray2
    },
    tooltipOverlay: {
      padding: '11px',
      backgroundColor: 'white',
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      maxWidth: '500px'
    },
    row: {
      display: 'flex',
      flexDirection: 'row'
    },
    questionSvg: {
      display: 'inline-flex',
      alignItems: 'center'
    },
    dollarSvg: {
      display: 'inline-flex',
      alignItems: 'center',
      paddingRight: '4px'
    },
    spacing: {
      paddingRight: '7px'
    },
    affiliatePaddingRight: {
      paddingRight: '4px'
    },
    logo: {
      width: '22px',
      height: '22px',
      borderRadius: '2px',
      objectFit: 'scale-down'
    },
    logoContainer: {
      paddingRight: '10px',
      display: 'inline-flex'
    },
    logoPlaceholder: {
      paddingRight: '32px'
    },
    autoCompleteLogo: {
      width: '30px',
      height: '30px',
      borderRadius: '2px',
      objectFit: 'scale-down'
    },
    noBackground: {
      backgroundColor: 'none'
    },
    bigLogoContainer: {
      width: 122,
      height: 122,
      border: `1px solid ${colors.lightGray2}`,
      backgroundColor: 'white',
      borderRadius: '2px',
      marginRight: '22px'
    },
    bigLogo: {
      width: 120,
      height: 120,
      objectFit: 'scale-down'
    },
    productSelectionContainer: {
      backgroundColor: colors.white,
      height: 122,
      border: `1px solid ${colors.lightGray2}`,
      display: 'flex',
      width: '100%'
    },
    firstPartContainer: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      borderRight: `1px solid ${colors.lightGray2}`
    },
    firstPart: {
      width: '100%',
      paddingRight: '50px',
      paddingLeft: '50px'
    },
    paddingTopTable: {
      paddingTop: '24px'
    },
    autoSuggestRenderContainer: {
      display: 'inline-flex',
      alignItems: 'center',
      width: '100%',
      minHeight: 30
    },
    autoSuggestTitle: {
      paddingLeft: '10px',
      paddingRight: '10px',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden'
    },
    flex: {
      display: 'flex'
    },
    autoSuggestButton: {
      marginLeft: 'auto',
      display: 'flex'
    },
    autoSuggestPlusContainer: {
      paddingRight: '5px',
      display: 'flex',
      alignItems: 'center'
    },
    autoSuggestAdd: {
      ...makeTextStyle(fontWeights.medium, '12px'),
      paddingRight: '12px',
      color: colors.primaryBlue
    },
    subTitle: {
      color: colors.lightGray3,
      fontSize: '12px',
      paddingBottom: '16px'
    },
    secondPartContainer: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      borderRight: `1px solid ${colors.lightGray2}`
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { images, currencies, similarProducts, productsById, searchedProductIds } = this.props;
    const logo = images && images[0];
    return (
      <div>
        <Section style={styles.noBackground}>
          <FormSubtitle first>Add Similar Products</FormSubtitle>
          <FormDescription style={styles.description}>This way we can provide users with alternatives with, for example, a different price range.</FormDescription>
          <div style={styles.flex}>
            <div style={styles.bigLogoContainer}>
              <img
                src={logo && logo.url && `${logo.url}?height=203&width=360`}
                style={styles.bigLogo}/>
            </div>
            <div style={styles.productSelectionContainer}>
              <div style={styles.firstPartContainer}>
                <div style={styles.subTitle}>Add by product name</div>
                <div style={styles.firstPart}>
                  <Autosuggest
                    getItemText={(id) => productsById.getIn([ id, 'fullName' ])}
                    getOptions={this.slowSearchProducts}
                    isLoading={searchedProductIds.get('_status') === FETCHING}
                    name='productId'
                    options={searchedProductIds.get('data').toJS()}
                    placeholder='Product name'
                    renderOption={(id) => {
                      return (<div style={styles.autoSuggestRenderContainer}>
                        <ToolTip
                          overlay={<img src={`${productsById.getIn([ id, 'logo', 'url' ])}?height=150&width=150`}/>}
                          placement='top'
                          prefixCls='no-arrow'>
                          <img src={`${productsById.getIn([ id, 'logo', 'url' ])}?height=150&width=150`} style={styles.autoCompleteLogo} />
                        </ToolTip>
                        <div style={styles.autoSuggestTitle}>{productsById.getIn([ id, 'fullName' ])}</div>
                        <div style={styles.autoSuggestButton}>
                          <div style={styles.autoSuggestPlusContainer}><PlusSVG color={colors.primaryBlue}/></div>
                          <div style={styles.autoSuggestAdd}>Add</div></div>
                      </div>);
                    }}
                    required
                    onChange={this.onClickAddSimilarProduct}/>
                  </div>
                </div>
                <div style={styles.secondPartContainer}>
                  <div style={styles.subTitle}>Add by Image comparison</div>
                  <button style={[ buttonStyles.base, buttonStyles.small, buttonStyles.blue ]} onClick={this.openImageCompareModal}>Start comparing</button>
                </div>
              </div>
            </div>
        </Section>
        <Section>
          <FormSubtitle first>Already added</FormSubtitle>
          <div style={styles.paddingTopTable}/>
          <Table style={styles.customTable}>
            <Headers>
              {/* Be aware that width or flex of each headerCel and the related rowCel must be the same! */}
              <CustomCel style={[ headerStyles.base, headerStyles.first, styles.adaptedCustomCel, { flex: 2 } ]}>Product</CustomCel>
              <CustomCel style={[ headerStyles.base, styles.adaptedCustomCel, { flex: 2 } ]}>Brand</CustomCel>
              <CustomCel style={[ headerStyles.base, styles.adaptedCustomCel, { width: 150 } ]}>Offerings</CustomCel>
              <CustomCel style={[ headerStyles.base, styles.adaptedCustomCel, { width: 30 } ]} />
            </Headers>
            <Rows style={styles.adaptedRows}>
              {similarProducts.get('data').map((similarProduct, index) => {
                const offeringsArray = similarProduct.getIn([ 'product2', 'offerings' ]) && similarProduct.getIn([ 'product2', 'offerings' ]).toArray() || [];
                const numberOfAffiliates = offeringsArray.reduce((total, offer, key) => offer.get('affiliateCode') ? total + 1 : total, 0);
                const numberOfNonAffiliates = offeringsArray.length - numberOfAffiliates;
                const offerings = offeringsArray.map((offering, i) => {
                  return (
                    <div key={`similarProduct${index}offering${i}`} style={[ styles.offeringContainer, ((i + 1) !== offeringsArray.length) && styles.offeringPaddingRight ]}>
                      {offering.get('affiliateCode') && <div style={styles.dollarSvg}><DollarSVG/></div>}
                      <span
                        style={styles.offeringShop}
                        onClick={() => { this.props.routerPushWithReturnTo(`/content/shops/read/${offering.getIn([ 'shop', 'id' ])}`); }}>
                          {offering.getIn([ 'shop', 'name' ])}
                      </span>
                      <span style={styles.offeringPrice}>
                        ({offering.getIn([ 'price', 'amount' ])}{currencies.getIn([ offering.getIn([ 'price', 'currency' ]), 'symbol' ])})
                        {((i + 1) !== offeringsArray.length) && <span>,</span>}
                      </span>
                    </div>
                  );
                });
                return (
                  <Row isFirst={index === 0} key={index} >
                    <CustomCel style={[ styles.adaptedCustomCel, { flex: 2 } ]} onClick={() => { this.props.routerPushWithReturnTo(`/content/products/read/${similarProduct.getIn([ 'product2', 'id' ])}`); }}>
                      {similarProduct.getIn([ 'product2', 'logo' ]) && <div style={styles.logoContainer}>
                        <ToolTip
                          overlay={<img src={`${similarProduct.getIn([ 'product2', 'logo', 'url' ])}?height=150&width=150`}/>}
                          placement='top'
                          prefixCls='no-arrow'>
                          <img src={`${similarProduct.getIn([ 'product2', 'logo', 'url' ])}?height=150&width=150`} style={styles.logo} />
                        </ToolTip>
                      </div> || <div style={styles.logoPlaceholder}/>} {similarProduct.getIn([ 'product2', 'fullName' ])}
                    </CustomCel>
                    <CustomCel style={[ styles.adaptedCustomCel, { flex: 2 } ]} onClick={() => { this.props.routerPushWithReturnTo(`/content/brands/read/${similarProduct.getIn([ 'product2', 'brand', 'id' ])}`); }}>
                      {similarProduct.getIn([ 'product2', 'brand', 'name' ])}
                    </CustomCel>
                    <CustomCel style={[ styles.adaptedCustomCel, { width: 150 } ]}>
                      <div style={styles.row}>
                        <div style={[ styles.row, styles.spacing ]}>
                          <div style={styles.dollarSvg}><DollarSVG/></div>
                          <div style={styles.affiliatePaddingRight}>{numberOfAffiliates}</div>
                          <div style={styles.dollarSvg}><DollarSVG color={colors.lightGray3}/></div>
                          <div>{numberOfNonAffiliates}</div>
                        </div>
                        <ToolTip
                          arrowContent={<div className='rc-tooltip-arrow-inner' />}
                          overlay={<div style={styles.tooltipOverlay}>
                            {offerings}
                          </div>}
                          placement='top'>
                          <div style={styles.questionSvg}><QuestionSVG color={colors.lightGray3} hoverColor={colors.darkGray2}/></div>
                        </ToolTip>
                      </div>
                    </CustomCel>
                    <CustomCel style={[ styles.adaptedCustomCel, { width: 30 } ]}>
                      <RemoveButton onClick={this.onClickDeleteSimilarProduct.bind(this, similarProduct.get('id'))} />
                    </CustomCel>
                  </Row>
                );
              })}
            </Rows>
          </Table>
          {this.state.openImageCompareModal &&
            <ImageCompareModal
              images={images}
              productId={this.props.productId}
              onClickAddSimilarProduct={this.onClickAddSimilarProduct}
              onClose={this.closeImageCompareModal}/>}
        </Section>
      </div>
    );
  }

}
