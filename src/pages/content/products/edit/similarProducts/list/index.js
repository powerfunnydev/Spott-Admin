/* eslint-disable react/no-set-state */
import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { bindActionCreators } from 'redux';
import Section from '../../../../../_common/components/section';
import { headerStyles, Table, Headers, CustomCel, Rows, Row } from '../../../../../_common/components/table/index';
import { colors, fontWeights, makeTextStyle, FormSubtitle, FormDescription } from '../../../../../_common/styles';
import Plus from '../../../../../_common/images/plus';
import EditButton from '../../../../../_common/components/buttons/editButton';
import RemoveButton from '../../../../../_common/components/buttons/removeButton';
import PersistSimilarProductModal from '../persist';
import { routerPushWithReturnTo } from '../../../../../../actions/global';
import selector from './selector';
import * as actions from './actions';

@connect(selector, (dispatch) => ({
  deleteSimilarProduct: bindActionCreators(actions.deleteSimilarProduct, dispatch),
  loadSimilarProducts: bindActionCreators(actions.loadSimilarProducts, dispatch),
  persistSimilarProduct: bindActionCreators(actions.persistSimilarProduct, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch)
}))
@Radium
export default class SimilarProducts extends Component {

  static propTypes = {
    deleteSimilarProduct: PropTypes.func.isRequired,
    loadSimilarProducts: PropTypes.func.isRequired,
    persistSimilarProduct: PropTypes.func.isRequired,
    productId: PropTypes.string.isRequired,
    routerPushWithReturnTo: PropTypes.func.isRequired,
    similarProducts: ImmutablePropTypes.map.isRequired
  };

  constructor (props) {
    super(props);
    this.getSimilarProduct = ::this.getSimilarProduct;
    this.onClickCreateSimilarProduct = ::this.onClickCreateSimilarProduct;
    this.onSubmit = ::this.onSubmit;
    this.state = {
      create: false,
      edit: false
    };
  }

  componentWillMount () {
    const { loadSimilarProducts, productId } = this.props;
    loadSimilarProducts({ productId });
  }

  transformSimilarProduct ({ id, price, currency, shopId, url }) {
    return {
      id,
      buyUrl: url,
      shopId,
      price: { amount: price, currency }
    };
  }

  getSimilarProduct (index) {
    const { id, shop, price, locale, buyUrl } = this.props.similarProducts.getIn([ 'data', index ]).toJS();
    return {
      productOfferingId: id,
      productId: this.props.productId,
      shopId: shop.id,
      currency: price.currency,
      amount: price.amount,
      buyUrl,
      locale
    };
  }

  onClickCreateSimilarProduct (e) {
    e.preventDefault();
    this.setState({ create: true });
  }

  async onClickDeleteSimilarProduct (productOfferingId) {
    const { deleteSimilarProduct, loadSimilarProducts, productId } = this.props;
    await deleteSimilarProduct({ productOfferingId, productId });
    await loadSimilarProducts({ productId });
  }

  async onSubmit (form) {
    console.log('form', form);
    const { loadSimilarProducts, persistSimilarProduct, productId } = this.props;
    await persistSimilarProduct(form);
    await loadSimilarProducts({ productId });
  }

  static styles = {
    add: {
      ...makeTextStyle(fontWeights.medium, '0.75em'),
      color: colors.primaryBlue,
      flex: 8,
      justifyContent: 'center',
      backgroundColor: 'rgba(244, 245, 245, 0.5)'
    },
    editButton: {
      marginRight: '0.75em'
    },
    description: {
      marginBottom: '1.25em'
    },
    adaptedCustomCel: {
      fontSize: '11px',
      paddingTop: '5px',
      paddingBottom: '5px',
      minHeight: '30px'
    },
    adaptedRows: {
      minHeight: '3.75em'
    },
    customTable: {
      border: `1px solid ${colors.lightGray2}`
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { similarProducts } = this.props;
    console.log('similarProducts', similarProducts && similarProducts.toJS());
    return (
      <Section>
        <FormSubtitle first>Offerings for this product</FormSubtitle>
        <FormDescription style={styles.description}>Offerings is a list that indicates where this product is for sale and for what price.</FormDescription>
        <Table style={styles.customTable}>
          <Headers>
            {/* Be aware that width or flex of each headerCel and the related rowCel must be the same! */}
            <CustomCel style={[ headerStyles.header, headerStyles.firstHeader, styles.adaptedCustomCel, { flex: 2 } ]}>
              Product
            </CustomCel>
            <CustomCel style={[ headerStyles.header, headerStyles.notFirstHeader, styles.adaptedCustomCel, { width: 100 } ]} />
          </Headers>
          <Rows style={styles.adaptedRows}>
            {similarProducts.get('data').map((productOffering, index) => {
              return (
                <Row isFirst={index === 0} key={index} >
                  <CustomCel
                    style={[ styles.adaptedCustomCel, { flex: 2 } ]}
                    onClick={() => { this.props.routerPushWithReturnTo(`/content/shops/read/${productOffering.getIn([ 'shop', 'id' ])}`); }}>
                    {productOffering.getIn([ 'shop', 'name' ])}
                  </CustomCel>
                  <CustomCel style={[ styles.adaptedCustomCel, { width: 100 } ]}>
                    <EditButton style={styles.editButton} onClick={() => this.setState({ edit: index })} />
                    <RemoveButton onClick={this.onClickDeleteSimilarProduct.bind(this, productOffering.get('id'))} />
                  </CustomCel>
                </Row>
              );
            })}
            <Row isFirst={similarProducts.get('data').size === 0} >
              <CustomCel style={[ styles.add, styles.adaptedCustomCel ]} onClick={this.onClickCreateSimilarProduct}>
                <Plus color={colors.primaryBlue} />&nbsp;&nbsp;&nbsp;Add Product
              </CustomCel>
            </Row>
          </Rows>
          {this.state.create &&
            <PersistSimilarProductModal
              initialValues={{
                productId: this.props.productId
              }}
              onClose={() => this.setState({ create: false })}
              onSubmit={this.onSubmit} />}
          {typeof this.state.edit === 'number' &&
            <PersistSimilarProductModal
              edit
              initialValues={this.getSimilarProduct(this.state.edit)}
              onClose={() => this.setState({ edit: false })}
              onSubmit={this.onSubmit} />}
        </Table>
      </Section>
    );
  }

}
