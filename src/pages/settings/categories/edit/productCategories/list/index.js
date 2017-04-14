/* eslint-disable react/no-set-state */
import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { bindActionCreators } from 'redux';
import { headerStyles, Table, Headers, CustomCel, Rows, Row } from '../../../../../_common/components/table/index';
import { colors, fontWeights, makeTextStyle, FormSubtitle } from '../../../../../_common/styles';
import Plus from '../../../../../_common/images/plus';
import EditButton from '../../../../../_common/components/buttons/editButton';
import RemoveButton from '../../../../../_common/components/buttons/removeButton';
import PersistProductCategoryModal from '../persist';
import { routerPushWithReturnTo } from '../../../../../../actions/global';
import selector from './selector';
import * as actions from './actions';

@connect(selector, (dispatch) => ({
  deleteProductCategory: bindActionCreators(actions.deleteProductCategory, dispatch),
  loadProductCategories: bindActionCreators(actions.loadProductCategories, dispatch),
  persistProductCategory: bindActionCreators(actions.persistProductCategory, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch)
}))
@Radium
export default class ProductCategories extends Component {

  static propTypes = {
    deleteProductCategory: PropTypes.func.isRequired,
    loadProductCategories: PropTypes.func.isRequired,
    persistProductCategory: PropTypes.func.isRequired,
    productCategories: ImmutablePropTypes.map.isRequired,
    routerPushWithReturnTo: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onClickCreateProductCategory = ::this.onClickCreateProductCategory;
    this.onSubmit = ::this.onSubmit;
    this.state = {
      create: false,
      edit: false
    };
  }

  componentWillMount () {
    const { loadProductCategories } = this.props;
    loadProductCategories({});
  }

  onClickCreateProductCategory (e) {
    e.preventDefault();
    this.setState({ create: true });
  }

  async onClickDeleteProductCategory (productCategoryId) {
    const { deleteProductCategory, loadProductCategories } = this.props;
    await deleteProductCategory({ productCategoryId });
    await loadProductCategories({});
  }

  async onSubmit (form) {
    const { loadProductCategories, persistProductCategory } = this.props;
    const locales = [ 'en' ];
    const { nameCopy } = form;
    // nameCopy contains local data.
    Object.keys(nameCopy).map((locale) => {
      if (!nameCopy[locale]) { // true or false. False when there is a custom value for a particular language.
        locales.push(locale);
      }
    });
    await persistProductCategory({
      defaultLocale: 'en',
      locales,
      ...form }
    );
    await loadProductCategories({});
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
    },
    whiteSpace: {
      paddingTop: '20px'
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { productCategories } = this.props;
    return (
      <div>
        <FormSubtitle>Product Categories</FormSubtitle>
        <div style={styles.whiteSpace}/>
        <Table style={styles.customTable}>
          <Headers>
            {/* Be aware that width or flex of each headerCel and the related rowCel must be the same! */}
            <CustomCel style={[ headerStyles.base, headerStyles.first, styles.adaptedCustomCel, { flex: 2 } ]}>
              Product Category
            </CustomCel>
            <CustomCel style={[ headerStyles.base, styles.adaptedCustomCel, { width: 60 } ]} />
          </Headers>
          <Rows style={styles.adaptedRows}>
            {productCategories.get('data').map((productCategory, index) => {
              return (
                <Row isFirst={index === 0} key={index} >
                  <CustomCel
                    style={[ styles.adaptedCustomCel, { flex: 2 } ]}>
                    {productCategory.get('name')}
                  </CustomCel>
                  <CustomCel style={[ styles.adaptedCustomCel, { width: 60 } ]}>
                    <EditButton style={styles.editButton} onClick={() => this.setState({ edit: productCategory.get('id') })} />
                    <RemoveButton onClick={this.onClickDeleteProductCategory.bind(this, productCategory.get('id'))} />
                  </CustomCel>
                </Row>
              );
            })}
            <Row isFirst={productCategories.get('data').size === 0} >
              <CustomCel style={[ styles.add, styles.adaptedCustomCel ]} onClick={this.onClickCreateProductCategory}>
                <Plus color={colors.primaryBlue} />&nbsp;&nbsp;&nbsp;Add Product Category
              </CustomCel>
            </Row>
          </Rows>
          {this.state.create &&
            <PersistProductCategoryModal
              onClose={() => this.setState({ create: false })}
              onSubmit={this.onSubmit} />}
          {typeof this.state.edit === 'string' &&
            <PersistProductCategoryModal
              edit
              productCategoryId={this.state.edit}
              onClose={() => this.setState({ edit: false })}
              onSubmit={this.onSubmit} />}
        </Table>
      </div>
    );
  }

}
