import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import Radium from 'radium';
import { connect } from 'react-redux';
import { reduxForm, Field, Fields } from 'redux-form/immutable';
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

function renderRelevanceInput ({ input, style }) {
  return (
    <div style={style}>
      <RelevanceOption
        checked={input.value === 'EXACT'}
        checkedColor='rgb(32, 142, 59)'
        color='rgb(172, 250, 159)'
        input={input}
        label='Exact'
        value='EXACT' />
      <RelevanceOption
        checked={input.value === 'MEDIUM'}
        checkedColor='rgb(248, 170, 15)'
        color='rgb(254, 238, 207)'
        input={input}
        label='Medium'
        value='MEDIUM'/>
      <RelevanceOption
        checked={input.value === 'LOW'}
        checkedColor='rgb(236, 65, 15)'
        color='rgb(251, 217, 207)'
        input={input}
        label='Low'
        value='LOW'/>
    </div>
  );
}
renderRelevanceInput.propTypes = {
  input: PropTypes.object.isRequired,
  style: PropTypes.object
};

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
renderCharacterInput.propTypes = {
  characters: ImmutablePropTypes.list.isRequired,
  style: PropTypes.object
};

@Radium
class ProductMarker extends Component {

  static propTypes = {
    allowProductSuggestions: PropTypes.bool,
    appearance: ImmutablePropTypes.map,
    change: PropTypes.func.isRequired,
    characters: ImmutablePropTypes.list.isRequired,
    cmsNextBaseUrl: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    fetchSimilarProducts: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    initialize: PropTypes.func.isRequired,
    productId: PropTypes.string,
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
    this.renderSearchInputs = ::this.renderSearchInputs;
    this.submit = ::this.submit;
    this.onCancel = ::this.onCancel;
    this.onRequestClose = ::this.onRequestClose;
    this.onSuggestionsCancel = ::this.onSuggestionsCancel;
    this.onSuggestionSelect = ::this.onSuggestionSelect;
    this.onSeeProductSuggestions = ::this.onSeeProductSuggestions;
  }

  componentDidMount () {
    const { appearance } = this.props;
    if (appearance) {
      this.props.initialize({ ...appearance.toJS(), productId: appearance.get('id') });
    }
  }

  async submit (form) {
    await this.props.onSubmit(form.toJS());
  }

  onCancel (e) {
    e.preventDefault();
    this.props.onCancel();
  }

  onRequestClose () {
    this.props.onCancel();
  }

  onSuggestionsCancel () {
    this.props.onClearProductSuggestions();
  }

  onSuggestionSelect (id) {
    const { change, dispatch } = this.props;
    dispatch(change('productId', id));
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
        width: '50%'
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

  renderSearchInputs ({ fetchSimilarProducts, product, productId, productSearchResult, search }) {
    const styles = this.constructor.styles;
    return (
      <div>
        <div style={styles.filters}>
          <input
            {...search.brandName.input}
            placeholder='Brand'
            style={{ ...styles.textInput.base, ...styles.textInput.first }}
            type='text' />
          <input
            {...search.productOfferingShopName.input}
            placeholder='Shop'
            style={styles.textInput.base}
            type='text' />
        </div>
        <div style={styles.filters}>
          <input
            {...search.productOfferingPriceFrom.input}
            min='0'
            placeholder='€ from'
            style={{ ...styles.textInput.base, ...styles.textInput.first }}
            type='number' />
          <input
            {...search.productOfferingPriceTo.input}
            min='0'
            placeholder='€ to'
            style={styles.textInput.base}
            type='number' />
          <div style={{ display: 'flex', alignItems: 'center', color: 'rgb(123, 129, 134)', fontSize: '0.875em', marginLeft: 5 }}>
            <input
              {...search.affiliate.input}
              type='checkbox' />
            &nbsp;&nbsp;Affiliate
          </div>
        </div>
        <ProductSearch
          focus
          options={productSearchResult.get('data').toArray()}
          search={({ searchString }) => {
            const { affiliate, brandName, productOfferingPriceFrom, productOfferingPriceTo, productOfferingShopName } = search;
            this.props.searchProducts({
              affiliate: affiliate.input.value,
              brandName: brandName.input.value,
              productOfferingPriceFrom: productOfferingPriceFrom.input.value,
              productOfferingPriceTo: productOfferingPriceTo.input.value,
              productOfferingShopName: productOfferingShopName.input.value,
              searchString
            });
          }}
          value={product && product.get('shortName')}
          onOptionSelected={(p) => {
            const id = p && p.get('id');
            productId.input.onChange(id);
            if (id) {
              fetchSimilarProducts({ productId: id });
            }
          }} />
        {productId.meta.touched && productId.meta.error === 'required' && <span style={modalStyle.error}>Product is required.</span>}
      </div>
    );
  }

  render () {
    const styles = this.constructor.styles;
    const {
      allowProductSuggestions, characters, cmsNextBaseUrl, fetchSimilarProducts, handleSubmit, productId, products,
      productSearchResult, productSuggestions, similarProducts, title
    } = this.props;

    const product = products.get(productId);

    return (
      <ReactModal
        isOpen
        style={dialogStyle}
        onRequestClose={this.onRequestClose}>
        {!productSuggestions &&
          <form noValidate onSubmit={handleSubmit(this.submit)}>
            <div style={modalStyle.content}>
              <h1 style={modalStyle.title}>{title}</h1>

              <h3 style={modalStyle.subtitle}>Find product</h3>

              <div style={modalStyle.search}>

                <Fields
                  component={this.renderSearchInputs}
                  fetchSimilarProducts={fetchSimilarProducts}
                  names={[
                    'productId',
                    'search.affiliate',
                    'search.brandName',
                    'search.productOfferingPriceFrom',
                    'search.productOfferingPriceTo',
                    'search.productOfferingShopName'
                  ]}
                  product={product}
                  productSearchResult={productSearchResult} />

                <div style={styles.buttons}>
                  {this.renderSimilarProducts(product, similarProducts)}
                  {product && product.get('id') &&
                    <a href={`${cmsNextBaseUrl}/#/content/products/edit/${product.get('id')}`} style={[ buttonStyle.base, buttonStyle.small, styles.grayButton, styles.link ]} target='_blank'>Edit product</a>}

                  {allowProductSuggestions &&
                    <button key='suggestions' style={[ buttonStyle.base, buttonStyle.small, styles.grayButton ]} onClick={this.onSeeProductSuggestions}>See suggestions</button>}
                </div>
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
              <button key='cancel' style={[ buttonStyle.base, buttonStyle.cancel ]} type='button' onClick={this.onCancel}>Cancel</button>
              <button key='save' style={[ buttonStyle.base, buttonStyle.save ]} type='submit'>Done</button>
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

@connect(createProductMarkerSelector, {
  fetchSimilarProducts: productActions.fetchSimilarProducts,
  searchProducts: productActions.searchProducts,
  onCancel: productActions.createProductMarkerCancel,
  onSubmit: productActions.createProductMarkerModal
})
@reduxForm({
  form: 'createProductMarker',
  initialValues: {
    markerHidden: false,
    relevance: 'EXACT'
  }
})
export class CreateProductMarker extends Component {

  static propTypes = {
    allowProductSuggestions: PropTypes.bool,
    characters: ImmutablePropTypes.list.isRequired,
    cmsNextBaseUrl: PropTypes.string.isRequired,
    fetchSimilarProducts: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
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

@connect(updateProductMarkerSelector, {
  fetchSimilarProducts: productActions.fetchSimilarProducts,
  searchProducts: productActions.searchProducts,
  onCancel: productActions.updateProductMarkerCancel,
  onSubmit: productActions.updateProductMarker
})
@reduxForm({
  form: 'updateProductMarker'
})
export class UpdateProductMarker extends Component {

  static propTypes = {
    allowProductSuggestions: PropTypes.bool,
    characters: ImmutablePropTypes.list.isRequired,
    cmsNextBaseUrl: PropTypes.string.isRequired,
    fetchSimilarProducts: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
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
