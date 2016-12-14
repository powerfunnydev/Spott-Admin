import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form/immutable';
import ReactModal from 'react-modal';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Checkbox from '../../_helpers/checkbox';
import RelevanceOption from './relevanceOption';
import Character from './character';
import ProductSearch from './search';
import * as productActions from '../../../actions/product';
import { createProductMarkerSelector, updateProductMarkerSelector } from '../../../selectors/productMarker';
import { buttonStyle, dialogStyle, colors, modalStyle } from '../styles';

@Radium
class ProductSuggestion extends Component {

  static propTypes = {
    accuracy: PropTypes.number.isRequired,
    imageUrl: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onClick = ::this.onClick;
  }

  onClick (e) {
    e.preventDefault();
    this.props.onClick();
  }

  static styles = {
    wrapper: {
      display: 'inline-block',
      width: '126px', // 1/3th of total
      height: '126px' // Make it a square
    },
    container: {
      position: 'relative',
      backgroundPosition: 'center',
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      cursor: 'pointer',
      width: '100%',
      height: '100%',
      WebkitFilter: 'brightness(100%)',
      transition: 'filter 0.3s ease-in-out',
      ':hover': {
        WebkitFilter: 'brightness(130%)'
      }
    },
    accuracy: {
      backgroundColor: 'rgba(255, 255, 255, .9)',
      fontSize: '10px',
      textColor: '#fff',
      padding: 3,
      position: 'absolute',
      right: 10,
      bottom: 10
    }
  };

  render () {
    const { styles } = this.constructor;
    const { accuracy, imageUrl } = this.props;
    return (
      <div style={styles.wrapper} onClick={this.onClick}>
        <div style={[ styles.container, { backgroundImage: `url('${imageUrl}')` } ]}>
          <div style={styles.accuracy}>{`${Math.round(accuracy * 100)}%`}</div>
        </div>
      </div>
    );
  }

}

@Radium
export default class ProductSuggestions extends Component {

  static propTypes = {
    productSuggestions: ImmutablePropTypes.list.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onCancelClick = ::this.onCancelClick;
  }

  onCancelClick (e) {
    e.preventDefault();
    this.props.onCancel();
  }

  static styles = {
    title: {
      // Basic style
      color: 'rgb(0, 115, 211)',
      fontFamily: 'Rubik-Regular',
      fontWeight: 'normal',
      fontSize: '30px',
      // Positioning
      margin: 0,
      paddingBottom: 25,
      paddingTop: 0,
      textAlign: 'center'
    },
    suggestions: {
      fontSize: 0,
      maxHeight: 350,
      paddingRight: 20, // Scrollbar positioning
      marginRight: -20, // Scrollbar positioning
      overflowY: 'auto'
    }
  };

  render () {
    const { productSuggestions } = this.props;
    const styles = this.constructor.styles;
    // Render form if there are items
    if (productSuggestions.size > 0) {
      return (
        <form>
          <div style={modalStyle.content}>
            <h1 style={styles.title}>Suggestions</h1>
            <div style={styles.suggestions}>
              {productSuggestions.map((ps) =>
                <ProductSuggestion accuracy={ps.get('accuracy')}
                  imageUrl={ps.getIn([ 'product', 'imageUrl' ])}
                  key={ps.getIn([ 'product', 'id' ])}
                  onClick={this.props.onSelect.bind(this, ps.getIn([ 'product', 'id' ]))} />)}
            </div>
          </div>
          <div style={modalStyle.footer}>
            <button key={'cancel'} style={[ buttonStyle.base, buttonStyle.cancel ]} onClick={this.onCancelClick}>Cancel</button>
          </div>
        </form>
      );
    }
    // Render form if there are no items
    return (
      <form>
        <div style={modalStyle.content}>
          <h1 style={styles.title}>Suggestions</h1>
          <p>Could not suggest any products based on the selected region.</p>
        </div>
        <div style={modalStyle.footer}>
          <button key={'cancel'} style={[ buttonStyle.base, buttonStyle.cancel ]} onClick={this.onCancelClick}>OK</button>
        </div>
      </form>
    );
  }

}

function renderInputField ({ input, meta, ...res }) {
  return (
    <input
      {...input}
      {...res} />
  );
}

function renderRelevanceInput ({ style, ...props }) {
  return (
    <div style={style}>
      <RelevanceOption
        {...props}
        checked={props.input.value === 'EXACT'}
        checkedColor='rgb(32, 142, 59)'
        color='rgb(172, 250, 159)'
        label='Exact'
        value='EXACT' />
      <RelevanceOption
        {...props}
        checked={props.input.value === 'MEDIUM'}
        checkedColor='rgb(248, 170, 15)'
        color='rgb(254, 238, 207)'
        label='Medium'
        value='MEDIUM'/>
      <RelevanceOption
        {...props}
        checked={props.input.value === 'LOW'}
        checkedColor='rgb(236, 65, 15)'
        color='rgb(251, 217, 207)'
        label='Low'
        value='LOW'/>
    </div>
  );
}

function renderCharacterInput ({ characters, style, ...props }) {
  return (
    <div style={style}>
      <Character
        {...props}
        character={null}
        key='none' />
      {characters.map((character, i) => (
        <Character
          {...props}
          character={character}
          key={character.get('id')} />
      ))}
    </div>
  );
}

@Radium
class ProductMarker extends Component {

  static propTypes = {
    allowProductSuggestions: PropTypes.bool,
    characters: ImmutablePropTypes.list.isRequired,
    fetchSimilarProducts: PropTypes.func.isRequired,
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    productSearchResult: ImmutablePropTypes.map.isRequired,
    productSuggestions: ImmutablePropTypes.list,
    products: ImmutablePropTypes.map.isRequired,
    searchProducts: PropTypes.func.isRequired,
    similarProducts: ImmutablePropTypes.map.isRequired,
    title: PropTypes.string.isRequired,
    // Callback for closing the dialog and clearing the form.
    onCancel: PropTypes.func.isRequired,
    onClearProductSuggestions: PropTypes.func,
    onSeeProductSuggestions: PropTypes.func,
    // Callback for opening the "create product" modal
    onSubmit: PropTypes.func
  };

  constructor (props) {
    super(props);
    this.searchProducts = ::this.searchProducts;
    this.onCancel = ::this.onCancel;
    this.onRequestClose = ::this.onRequestClose;
    this.onProductSelect = ::this.onProductSelect;
    this.onSuggestionsCancel = ::this.onSuggestionsCancel;
    this.onSuggestionSelect = ::this.onSuggestionSelect;
    this.onSeeProductSuggestions = ::this.onSeeProductSuggestions;
  }

  searchProducts ({ searchString }) {
    const { brandName, productOfferingPriceFrom, productOfferingPriceTo, productOfferingShopName } = this.props.fields.search;
    this.props.searchProducts({
      brandName: brandName.value,
      productOfferingPriceFrom: productOfferingPriceFrom.value,
      productOfferingPriceTo: productOfferingPriceTo.value,
      productOfferingShopName: productOfferingShopName.value,
      searchString
    });
  }

  onCancel (e) {
    e.preventDefault();
    this.props.onCancel();
  }

  onRequestClose () {
    this.props.onCancel();
  }

  onProductSelect (product) {
    const productId = product && product.get('id');
    this.props.fields.productId.onChange(productId);
    if (productId) {
      this.props.fetchSimilarProducts({ productId });
    }
  }

  onSuggestionsCancel () {
    this.props.onClearProductSuggestions();
  }

  onSuggestionSelect (id) {
    this.props.fields.productId.onChange(id);
    this.props.onClearProductSuggestions();
  }

  /**
   * Closes this modal, opening the "Product suggestions" modal instead.
   */
  onSeeProductSuggestions (e) {
    e.preventDefault();
    this.props.onSeeProductSuggestions();
  }

  static styles = {
    characters: {
      borderBottom: 'solid 1px rgb(220, 222, 223)',
      display: 'flex',
      flexWrap: 'wrap',
      paddingBottom: 20
    },
    checkbox: {
      base: {
        paddingBottom: 18
      },
      first: {
        paddingTop: 18
      }
    },
    relevanceOptions: {
      borderBottom: 'solid 1px rgb(220, 222, 223)',
      borderTop: 'solid 1px rgb(220, 222, 223)',
      display: 'flex',
      justifyContent: 'space-between',
      paddingBottom: 18,
      paddingTop: 18
    },
    grayButton: {
      backgroundColor: 'rgb(123, 129, 134)',
      color: 'rgb(220, 222, 223)',
      fontFamily: 'Rubik-Regular'
    },
    buttons: {
      alignItems: 'flex-end',
      display: 'flex',
      justifyContent: 'flex-end'
    },
    link: {
      fontFamily: 'Rubik-Regular',
      textDecoration: 'none'
    },
    filters: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: 5,
      marginTop: 5
    },
    textInput: {
      base: {
        border: `1px solid ${colors.gray}`,
        borderRadius: 4,
        fontSize: '14px',
        height: 30,
        padding: 4,
        marginLeft: 5,
        width: '25%'
      },
      first: {
        marginLeft: 0
      }
    },
    similarProducts: {
      fontFamily: 'Rubik-Regular',
      fontSize: '13px',
      marginRight: 15,
      color: 'rgb(45, 48, 50)'
    }
  };

  renderSimilarProducts (product, similarProducts) {
    const styles = this.constructor.styles;
    if (product && product.get('id')) {
      const title = similarProducts.get('data').map((similarProduct) => similarProduct.getIn([ 'product', 'shortName' ])).join(', ');
      return (
        <span
          style={styles.similarProducts}
          title={title}>
          {similarProducts.get('data').size} similar products
        </span>
      );
    }
  }

  render () {
    const styles = this.constructor.styles;
    const {
      allowProductSuggestions, characters, handleSubmit, productSearchResult, productSuggestions, products, similarProducts, title, onSubmit
    } = this.props;

    // HACK: Redux-form will initialize the field with value: undefined, and initialValue: 'productIdToUpdate'.
    // We do a fallback on initialValue because otherwise the typeahead serach in ProductSearch won't rerender!
    // const product = products.get(productId.value || productId.initialValue);

    return (
      <ReactModal
        isOpen
        style={dialogStyle}
        onRequestClose={this.onRequestClose}>
        {!productSuggestions &&
          <form noValidate onSubmit={handleSubmit}>
            <div style={modalStyle.content}>
              <h1 style={modalStyle.title}>{title}</h1>

              <h3 style={modalStyle.subtitle}>Find product</h3>

              <div style={modalStyle.search}>

                <div style={styles.filters}>
                  <Field
                    component={renderInputField}
                    name='search.brandName'
                    placeholder='Brand'
                    style={[ styles.textInput.base, styles.textInput.first ]}
                    type='text' />
                  <Field
                    component={renderInputField}
                    min='0'
                    name='search.productOfferingPriceFrom'
                    placeholder='€ from'
                    style={styles.textInput.base}
                    type='number' />
                  <Field
                    component={renderInputField}
                    min='0'
                    name='search.productOfferingPriceTo'
                    placeholder='€ to'
                    style={styles.textInput.base}
                    type='number' />
                  <Field
                    component={renderInputField}
                    name='search.productOfferingShopName'
                    placeholder='Shop'
                    style={styles.textInput.base}
                    type='text' />
                </div>

                {/* <ProductSearch
                  focus
                  options={productSearchResult.get('data').toArray()}
                  search={this.searchProducts}
                  value={product && product.get('shortName')}
                  onOptionSelected={this.onProductSelect} /> */}
                {/* {productId.error === 'required' && <span style={modalStyle.error}>Product is required.</span>} */}

                {/* <div style={styles.buttons}>
                  {this.renderSimilarProducts(product, similarProducts)}
                  {product && product.get('id') &&
                    <a href={`/#/content/products/edit/${product.get('id')}`} style={[ buttonStyle.base, buttonStyle.small, styles.grayButton, styles.link ]} target='_blank'>Edit product</a>}

                  {allowProductSuggestions &&
                    <button key='suggestions' style={[ buttonStyle.base, buttonStyle.small, styles.grayButton ]} onClick={this.onSeeProductSuggestions}>See suggestions</button>}
                </div> */}
              </div>

              <Field component={renderRelevanceInput} name='relevance' style={styles.relevanceOptions} />

              <h3 style={modalStyle.subtitle}>Worn by character</h3>
              <Field characters={characters} component={renderCharacterInput} name='characterId' style={styles.characters} />

              <Field
                component={Checkbox}
                label='Hide marker'
                name='markerHidden'
                style={[ styles.checkbox.base, styles.checkbox.first ]} />
              {allowProductSuggestions &&
                <Field
                  component={Checkbox}
                  label='Add for product suggestion'
                  name='productSuggestion'
                  style={styles.checkbox.base} />}
            </div>

            <div style={modalStyle.footer}>
              <button key='cancel' style={[ buttonStyle.base, buttonStyle.cancel ]} onClick={this.onCancel}>Cancel</button>
              <button key='save' style={[ buttonStyle.base, buttonStyle.save ]} onClick={onSubmit}>Done</button>
            </div>
          </form>}
        {productSuggestions &&
          <ProductSuggestions
            productSuggestions={productSuggestions}
            onCancel={this.onSuggestionsCancel}
            onSelect={this.onSuggestionSelect} />}
      </ReactModal>
    );
  }

}

@reduxForm({
  form: 'createProductMarker',
  initialValues: {
    markerHidden: false,
    relevance: 'EXACT'
  }
})
@connect(createProductMarkerSelector, {
  fetchSimilarProducts: productActions.fetchSimilarProducts,
  searchProducts: productActions.searchProducts,
  onCancel: productActions.createProductMarkerCancel,
  onSubmit: productActions.createProductMarkerModal
})
export class CreateProductMarker extends Component {

  static propTypes = {
    allowProductSuggestions: PropTypes.bool,
    characters: ImmutablePropTypes.list.isRequired,
    fetchSimilarProducts: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    initializeForm: PropTypes.func.isRequired,
    productSearchResult: ImmutablePropTypes.map.isRequired,
    productSuggestions: ImmutablePropTypes.list,
    products: ImmutablePropTypes.map.isRequired, // To visualise the selected product.
    searchProducts: PropTypes.func.isRequired,
    similarProducts: ImmutablePropTypes.map.isRequired,
    // Callback for closing the dialog and clearing the form.
    onCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func
  };

  render () {
    return (
      <ProductMarker
        title='Add product marker'
        {...this.props} />
    );
  }

}
// fields: [
//   'appearanceId',
//   'characterId',
//   'markerHidden',
//   'point',
//   'product',
//   'productId',
//   'productSuggestion',
//   'relevance',
//   'search.brandName',
//   'search.productOfferingPriceFrom',
//   'search.productOfferingPriceTo',
//   'search.productOfferingShopName'
// ],
// form: 'updateProductMarker',
//

@reduxForm({
  form: 'updateProductMarker'
})
@connect(updateProductMarkerSelector, {
  fetchSimilarProducts: productActions.fetchSimilarProducts,
  searchProducts: productActions.searchProducts,
  onCancel: productActions.updateProductMarkerCancel,
  onSubmit: productActions.updateProductMarker
})
export class UpdateProductMarker extends Component {

  static propTypes = {
    allowProductSuggestions: PropTypes.bool,
    characters: ImmutablePropTypes.list.isRequired,
    fetchSimilarProducts: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    initializeForm: PropTypes.func.isRequired,
    productSearchResult: ImmutablePropTypes.map.isRequired,
    productSuggestions: ImmutablePropTypes.list,
    products: ImmutablePropTypes.map.isRequired, // To visualise the selected product.
    searchProducts: PropTypes.func.isRequired,
    similarProducts: ImmutablePropTypes.map.isRequired,
    // Callback for closing the dialog and clearing the form.
    onCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func
  };

  render () {
    return (
      <ProductMarker
        title='Edit product marker'
        {...this.props} />
    );
  }

}
