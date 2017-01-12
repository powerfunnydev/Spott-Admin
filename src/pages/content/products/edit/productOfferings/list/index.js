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
import PersistProductOfferingModal from '../persist';
import { routerPushWithReturnTo } from '../../../../../../actions/global';
import selector from './selector';
import * as actions from './actions';

@connect(selector, (dispatch) => ({
  deleteProductOffering: bindActionCreators(actions.deleteProductOffering, dispatch),
  loadProductOfferings: bindActionCreators(actions.loadProductOfferings, dispatch),
  persistProductOffering: bindActionCreators(actions.persistProductOffering, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch)
}))
@Radium
export default class ProductOfferings extends Component {

  static propTypes = {
    deleteProductOffering: PropTypes.func.isRequired,
    loadProductOfferings: PropTypes.func.isRequired,
    persistProductOffering: PropTypes.func.isRequired,
    productId: PropTypes.string.isRequired,
    productOfferings: ImmutablePropTypes.map.isRequired,
    routerPushWithReturnTo: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.getProductOffering = ::this.getProductOffering;
    this.onClickCreateProductOffering = ::this.onClickCreateProductOffering;
    this.onSubmit = ::this.onSubmit;
    this.state = {
      create: false,
      edit: false
    };
  }

  componentWillMount () {
    const { loadProductOfferings, productId } = this.props;
    loadProductOfferings({ productId });
  }

  getProductOffering (index) {
    const { buyUrl, id, locale, price, productUrl, shop } = this.props.productOfferings.getIn([ 'data', index ]).toJS();
    return {
      amount: price.amount,
      buyUrl,
      currency: price.currency,
      locale,
      productId: this.props.productId,
      productOfferingId: id,
      productUrl,
      shopId: shop.id
    };
  }

  onClickCreateProductOffering (e) {
    e.preventDefault();
    this.setState({ create: true });
  }

  async onClickDeleteProductOffering (productOfferingId) {
    const { deleteProductOffering, loadProductOfferings, productId } = this.props;
    await deleteProductOffering({ productOfferingId, productId });
    await loadProductOfferings({ productId });
  }

  async onSubmit (form) {
    const { loadProductOfferings, persistProductOffering, productId } = this.props;
    await persistProductOffering(form);
    await loadProductOfferings({ productId });
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
    const { productOfferings } = this.props;
    return (
      <Section>
        <FormSubtitle first>Offerings for this product</FormSubtitle>
        <FormDescription style={styles.description}>Offerings is a list that indicates where this product is for sale and for what price.</FormDescription>
        <Table style={styles.customTable}>
          <Headers>
            {/* Be aware that width or flex of each headerCel and the related rowCel must be the same! */}
            <CustomCel style={[ headerStyles.header, headerStyles.firstHeader, styles.adaptedCustomCel, { flex: 2 } ]}>
              Shop
            </CustomCel>
            <CustomCel style={[ headerStyles.header, headerStyles.notFirstHeader, styles.adaptedCustomCel, { flex: 1 } ]}>
              Price
            </CustomCel>
            <CustomCel style={[ headerStyles.header, headerStyles.notFirstHeader, styles.adaptedCustomCel, { flex: 1 } ]}>
              Currency
            </CustomCel>
            <CustomCel style={[ headerStyles.header, headerStyles.notFirstHeader, styles.adaptedCustomCel, { flex: 1 } ]}>
              Locale
            </CustomCel>
            <CustomCel style={[ headerStyles.header, headerStyles.notFirstHeader, styles.adaptedCustomCel, { flex: 5 } ]}>
              Product url
            </CustomCel>
            <CustomCel style={[ headerStyles.header, headerStyles.notFirstHeader, styles.adaptedCustomCel, { flex: 5 } ]}>
              Affiliate url
            </CustomCel>
            <CustomCel style={[ headerStyles.header, headerStyles.notFirstHeader, styles.adaptedCustomCel, { flex: 1 } ]} />
          </Headers>
          <Rows style={styles.adaptedRows}>
            {productOfferings.get('data').map((productOffering, index) => {
              return (
                <Row isFirst={index === 0} key={index} >
                <CustomCel
                  style={[ styles.adaptedCustomCel, { flex: 2 } ]}
                  onClick={() => { this.props.routerPushWithReturnTo(`/content/shops/read/${productOffering.getIn([ 'shop', 'id' ])}`); }}>
                  {productOffering.getIn([ 'shop', 'name' ])}
                </CustomCel>
                  <CustomCel style={[ styles.adaptedCustomCel, { flex: 1 } ]}>
                    {productOffering.getIn([ 'price', 'amount' ])}
                  </CustomCel>
                  <CustomCel style={[ styles.adaptedCustomCel, { flex: 1 } ]}>
                    {productOffering.getIn([ 'price', 'currency' ])}
                  </CustomCel>
                  <CustomCel style={[ styles.adaptedCustomCel, { flex: 1 } ]}>
                    {productOffering.get('locale')}
                  </CustomCel>
                  <CustomCel
                    style={[ styles.adaptedCustomCel, { flex: 5 } ]}
                    onClick={() => { window.location = productOffering.get('productUrl'); }}>
                    {productOffering.get('productUrl')}
                  </CustomCel>
                  <CustomCel
                    style={[ styles.adaptedCustomCel, { flex: 5 } ]}
                    onClick={() => { window.location = productOffering.get('buyUrl'); }}>
                    {productOffering.get('buyUrl')}
                  </CustomCel>
                  <CustomCel style={[ styles.adaptedCustomCel, { flex: 1 } ]}>
                    <EditButton style={styles.editButton} onClick={() => this.setState({ edit: index })} />
                    <RemoveButton onClick={this.onClickDeleteProductOffering.bind(this, productOffering.get('id'))} />
                  </CustomCel>
                </Row>
              );
            })}
            <Row isFirst={productOfferings.get('data').size === 0} >
              <CustomCel style={[ styles.add, styles.adaptedCustomCel ]} onClick={this.onClickCreateProductOffering}>
                <Plus color={colors.primaryBlue} />&nbsp;&nbsp;&nbsp;Add Offering
              </CustomCel>
            </Row>
          </Rows>
          {this.state.create &&
            <PersistProductOfferingModal
              initialValues={{
                productId: this.props.productId
              }}
              onClose={() => this.setState({ create: false })}
              onSubmit={this.onSubmit} />}
          {typeof this.state.edit === 'number' &&
            <PersistProductOfferingModal
              edit
              initialValues={this.getProductOffering(this.state.edit)}
              onClose={() => this.setState({ edit: false })}
              onSubmit={this.onSubmit} />}
        </Table>
      </Section>
    );
  }

}
