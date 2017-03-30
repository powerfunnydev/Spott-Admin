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

function validate (values, { t }) {
  const validationErrors = {};
  // const { defaultLocale, name, url } = values.toJS();
  // if (!defaultLocale) { validationErrors.defaultLocale = t('common.errors.required'); }
  // if (!name) { validationErrors.name = t('common.errors.required'); }
  // if (!url) { validationErrors.url = t('common.errors.required'); }

  // Done
  return validationErrors;
}

@localized
@connect(tagsSelector, (dispatch) => ({
  searchProducts: bindActionCreators(actions.searchProducts, dispatch)
}))
@reduxForm({
  form: 'tagCreate',
  validate
})
@Radium
export default class CreateTag extends Component {

  static propTypes = {
    error: PropTypes.any,
    handleSubmit: PropTypes.func.isRequired,
    initialize: PropTypes.func.isRequired,
    searchProducts: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
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
    const { handleSubmit, productsById, searchedProductIds, onClose } = this.props;
    return (
      <PersistModal isOpen title='Tag your spott' onClose={onClose} onSubmit={handleSubmit(this.submit)}>
        <FormSubtitle first>Find product</FormSubtitle>
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
      </PersistModal>
    );
  }

}
