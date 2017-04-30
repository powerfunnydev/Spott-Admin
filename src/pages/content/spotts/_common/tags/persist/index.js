import React, { Component, PropTypes } from 'react';
import { reduxForm, Field, SubmissionError } from 'redux-form/immutable';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { FormSubtitle, buttonStyles } from '../../../../../_common/styles';
import SelectInput from '../../../../../_common/inputs/selectInput';
import RadioInput from '../../../../../_common/inputs/radioInput';
import localized from '../../../../../_common/decorators/localized';
import PersistModal from '../../../../../_common/components/persistModal';
import { slowdown } from '../../../../../../utils';
import ProductCharacter from './productCharacter';

const relevanceTypes = [
  { label: 'Exact', value: 'EXACT' },
  { label: 'Medium', value: 'MEDIUM' }
];

const entityTypes = [
  { label: 'Add product', value: 'PRODUCT' },
  { label: 'Add character', value: 'CHARACTER' },
  { label: 'Add person', value: 'PERSON' }
];

function validate (values, { t }) {
  const validationErrors = {};
  const { characterId, entityType, personId, productId, relevance } = values.toJS();

  switch (entityType) {
    case 'CHARACTER':
      if (!characterId) { validationErrors.characterId = t('common.errors.required'); }
      break;
    case 'PERSON':
      if (!personId) { validationErrors.personId = t('common.errors.required'); }
      break;
    case 'PRODUCT':
      if (!relevance) { validationErrors.relevance = t('common.errors.required'); }
      if (!productId) { validationErrors.productId = t('common.errors.required'); }
      break;
    default:
      validationErrors.entityType = t('common.errors.required');
  }

  // Done
  return validationErrors;
}

function renderProductCharacterInput ({ productCharacters, style, ...props }) {
  return (
    <div style={style}>
      <ProductCharacter
        {...props}
        empty
        key='none' />
      {productCharacters.map((pc, i) => (
        <ProductCharacter
          {...props}
          {...pc}
          key={pc.id} />
      ))}
    </div>
  );
}
renderProductCharacterInput.propTypes = {
  productCharacters: PropTypes.array.isRequired,
  style: PropTypes.object
};

export default function createPersistTag (selector, actions) {
  return (
    @localized
    @connect(selector, (dispatch) => ({
      searchCharacters: bindActionCreators(actions.searchCharacters, dispatch),
      searchPersons: bindActionCreators(actions.searchPersons, dispatch),
      searchProducts: bindActionCreators(actions.searchProducts, dispatch)
    }))
    @reduxForm({
      form: 'tagCreate',
      validate
    })
    @Radium
    class PersistTag extends Component {

      static propTypes = {
        charactersById: ImmutablePropTypes.map.isRequired,
        entityType: PropTypes.string,
        error: PropTypes.any,
        handleSubmit: PropTypes.func.isRequired,
        initialize: PropTypes.func.isRequired,
        personsById: ImmutablePropTypes.map.isRequired,
        productCharacters: PropTypes.array.isRequired,
        productsById: ImmutablePropTypes.map.isRequired,
        searchCharacters: PropTypes.func.isRequired,
        searchPersons: PropTypes.func.isRequired,
        searchProducts: PropTypes.func.isRequired,
        searchedCharacterIds: ImmutablePropTypes.map.isRequired,
        searchedPersonIds: ImmutablePropTypes.map.isRequired,
        searchedProductIds: ImmutablePropTypes.map.isRequired,
        selectedProductId: PropTypes.string,
        submitButtonText: PropTypes.string,
        t: PropTypes.func.isRequired,
        onClose: PropTypes.func.isRequired,
        onSubmit: PropTypes.func.isRequired
      };

      constructor (props) {
        super(props);
        this.searchCharacters = slowdown(props.searchCharacters, 300);
        this.searchPersons = slowdown(props.searchPersons, 300);
        this.searchProducts = slowdown(props.searchProducts, 300);
        this.submit = ::this.submit;
      }

      async submit (form) {
        try {
          const { onSubmit } = this.props;
          await onSubmit(form.toJS());
          this.props.onClose();
        } catch (error) {
          throw new SubmissionError({ _error: 'common.errors.unexpected' });
        }
      }

      static styles = {
        productCharacters: {
          display: 'flex',
          flexWrap: 'wrap',
          paddingTop: 14
        },
        grayButton: {
          backgroundColor: 'rgb(123, 129, 134)',
          color: 'rgb(220, 222, 223)',
          fontFamily: 'Rubik-Regular'
        },
        link: {
          fontFamily: 'Rubik-Regular',
          textDecoration: 'none'
        },
        buttons: {
          paddingTop: '10px',
          alignItems: 'flex-end',
          display: 'flex',
          justifyContent: 'flex-end'
        }
      };

      render () {
        const styles = this.constructor.styles;
        const {
          charactersById, entityType, handleSubmit, personsById, productCharacters, productsById,
          searchedCharacterIds, searchedPersonIds, searchedProductIds, selectedProductId, submitButtonText,
          onClose
        } = this.props;
        return (
          <PersistModal isOpen submitButtonText={submitButtonText} title='Tag your spott' onClose={onClose} onSubmit={handleSubmit(this.submit)}>
            <Field
              component={RadioInput}
              first
              name='entityType'
              options={entityTypes}
              optionsStyle={{ display: 'flex' }}/>
            {entityType === 'PRODUCT' &&
              <div>
                <FormSubtitle>Find product</FormSubtitle>
                <Field
                  component={SelectInput}
                  getItemImage={(id) => productsById.getIn([ id, 'logo', 'url' ])}
                  getItemText={(productId) => `${productsById.getIn([ productId, 'brand', 'name' ])} - ${productsById.getIn([ productId, 'fullName' ])}`}
                  getOptions={this.searchProducts}
                  isLoading={searchedProductIds.get('_status') !== 'loaded'}
                  label='Product name'
                  name='productId'
                  options={searchedProductIds.get('data').toArray()}
                  placeholder='Search for products'
                  required/>
                  <div style={styles.buttons}>
                  {selectedProductId &&
                    <a href={`/#/content/products/edit/${selectedProductId}`} style={[ buttonStyles.base, buttonStyles.extraSmall, styles.grayButton, styles.link ]} target='_blank'>Edit product</a>}
                  </div>
                <Field
                  component={RadioInput}
                  first
                  name='relevance'
                  options={relevanceTypes}/>
                <FormSubtitle>Worn by</FormSubtitle>
                <Field
                  component={renderProductCharacterInput}
                  name='productCharacter'
                  productCharacters={productCharacters}
                  style={styles.productCharacters} />
              </div>}
            {entityType === 'CHARACTER' &&
              <div>
                <FormSubtitle>Find character</FormSubtitle>
                <Field
                  component={SelectInput}
                  getItemImage={(id) => charactersById.getIn([ id, 'portraitImage', 'url' ])}
                  getItemText={(characterId) => charactersById.getIn([ characterId, 'name' ])}
                  getOptions={this.searchCharacters}
                  label='Character name'
                  name='characterId'
                  options={searchedCharacterIds.get('data').toArray()}
                  placeholder='Search for characters'
                  required/>
              </div>}
            {entityType === 'PERSON' &&
              <div>
                <FormSubtitle>Find person</FormSubtitle>
                <Field
                  component={SelectInput}
                  getItemImage={(id) => personsById.getIn([ id, 'portraitImage', 'url' ])}
                  getItemText={(personId) => personsById.getIn([ personId, 'fullName' ])}
                  getOptions={this.searchPersons}
                  label='Person name'
                  name='personId'
                  options={searchedPersonIds.get('data').toArray()}
                  placeholder='Search for persons'
                  required/>
              </div>}
          </PersistModal>
        );
      }

    }
  );
}
