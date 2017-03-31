import React, { Component, PropTypes } from 'react';
import { reduxForm, Field, SubmissionError } from 'redux-form/immutable';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { FormSubtitle } from '../../../../../_common/styles';
import SelectInput from '../../../../../_common/inputs/selectInput';
import RadioInput from '../../../../../_common/inputs/radioInput';
import localized from '../../../../../_common/decorators/localized';
import PersistModal from '../../../../../_common/components/persistModal';
import { slowdown } from '../../../../../../utils';
import * as actions from '../../actions';
import { tagsSelector } from '../../selector';

const relevanceTypes = [
  { label: 'Exact', value: 'EXACT' },
  { label: 'Medium', value: 'MEDIUM' }
];

const entityTypes = [
  { label: 'Add product', value: 'PRODUCT' },
  { label: 'Add character', value: 'CHARACTER' }
];

function validate (values, { t }) {
  const validationErrors = {};
  const { characterId, entityType, relevance, productId } = values.toJS();
  if (entityType) {
    if (entityType === 'CHARACTER') {
      if (!characterId) { validationErrors.characterId = t('common.errors.required'); }
    } else if (entityType === 'PRODUCT') {
      if (!relevance) { validationErrors.relevance = t('common.errors.required'); }
      if (!productId) { validationErrors.productId = t('common.errors.required'); }
    }
  } else {
    validationErrors.entityType = t('common.errors.required');
  }

  // Done
  return validationErrors;
}

@localized
@connect(tagsSelector, (dispatch) => ({
  searchCharacters: bindActionCreators(actions.searchCharacters, dispatch),
  searchProducts: bindActionCreators(actions.searchProducts, dispatch)
}))
@reduxForm({
  form: 'tagCreate',
  validate
})
@Radium
export default class CreateTag extends Component {

  static propTypes = {
    charactersById: ImmutablePropTypes.map.isRequired,
    entityType: PropTypes.string,
    error: PropTypes.any,
    handleSubmit: PropTypes.func.isRequired,
    initialize: PropTypes.func.isRequired,
    productsById: ImmutablePropTypes.map.isRequired,
    searchCharacters: PropTypes.func.isRequired,
    searchProducts: PropTypes.func.isRequired,
    searchedCharacterIds: ImmutablePropTypes.map.isRequired,
    searchedProductIds: ImmutablePropTypes.map.isRequired,
    t: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.searchCharacters = slowdown(props.searchCharacters, 300);
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

  render () {
    const { charactersById, entityType, handleSubmit, productsById, searchedCharacterIds, searchedProductIds, onClose } = this.props;
    return (
      <PersistModal isOpen title='Tag your spott' onClose={onClose} onSubmit={handleSubmit(this.submit)}>
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
              getItemText={(productId) => productsById.getIn([ productId, 'shortName' ])}
              getOptions={this.searchProducts}
              label='Product name'
              name='productId'
              options={searchedProductIds.get('data').toArray()}
              placeholder='Search for products'
              required/>
            <Field
              component={RadioInput}
              first
              name='relevance'
              options={relevanceTypes}/>
          </div>}
        {entityType === 'CHARACTER' &&
          <div>
            <FormSubtitle>Find character</FormSubtitle>
            <Field
              component={SelectInput}
              getItemText={(characterId) => charactersById.getIn([ characterId, 'name' ])}
              getOptions={this.searchCharacters}
              label='Character name'
              name='characterId'
              options={searchedCharacterIds.get('data').toArray()}
              placeholder='Search for characters'
              required/>
          </div>}
      </PersistModal>
    );
  }

}
