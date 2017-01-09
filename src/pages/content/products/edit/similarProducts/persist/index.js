import React, { Component, PropTypes } from 'react';
import { reduxForm, Field, SubmissionError } from 'redux-form/immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SelectInput from '../../../../../_common/inputs/selectInput';
import PersistModal from '../../../../../_common/components/persistModal';
import localized from '../../../../../_common/decorators/localized';
import selector from './selector';
import * as actions from './actions';
import { FETCHING } from '../../../../../../constants/statusTypes';

function validate (values, { t }) {
  const validationErrors = {};
  const { productId } = values.toJS();
  if (!productId) { validationErrors.productId = t('common.errors.required'); }
  // Done
  return validationErrors;
}

@localized
@connect(selector, (dispatch) => ({
  searchProducts: bindActionCreators(actions.searchProducts, dispatch)
}))
@reduxForm({
  form: 'productOffering',
  validate
})
@Radium
export default class ProductOfferingModal extends Component {

  static propTypes = {
    currencies: ImmutablePropTypes.map.isRequired,
    dispatch: PropTypes.func.isRequired,
    edit: PropTypes.bool,
    error: PropTypes.any,
    handleSubmit: PropTypes.func.isRequired,
    localeNames: ImmutablePropTypes.map.isRequired,
    productsById: ImmutablePropTypes.map.isRequired,
    searchProducts: PropTypes.func.isRequired,
    searchedProductIds: ImmutablePropTypes.map.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onCloseClick = ::this.onCloseClick;
    this.submit = ::this.submit;
  }

  async submit (form) {
    try {
      await this.props.onSubmit(form.toJS());
      this.onCloseClick();
    } catch (error) {
      throw new SubmissionError({ _error: 'common.errors.unexpected' });
    }
  }

  onCloseClick () {
    this.props.onClose();
  }

  static styles = {
    checkbox: {
      paddingBottom: '0.438em'
    },
    checkboxLabel: {
      paddingBottom: '0.7em'
    },
    col2: {
      display: 'flex',
      flexDirection: 'row'
    },
    dateInput: {
      flex: 1,
      paddingRight: '0.313em'
    },
    timeInput: {
      alignSelf: 'flex-end',
      flex: 1,
      paddingLeft: '0.313em'
    }
  };

  render () {
    const { productsById, searchProducts, searchedProductIds, edit, handleSubmit } = this.props;
    console.log('productsById', productsById && productsById.toJS());
    return (
      <PersistModal isOpen submitButtonText={edit ? 'Save' : 'Add'} title={edit ? 'Edit Offering' : 'Add Offering'} onClose={this.onCloseClick} onSubmit={handleSubmit(this.submit)}>
        <Field
          component={SelectInput}
          getItemText={(id) => productsById.getIn([ id, 'shortName' ])}
          getOptions={searchProducts}
          isLoading={searchedProductIds.get('_status') === FETCHING}
          label='Product'
          name='productId'
          options={searchedProductIds.get('data').toJS()}
          placeholder='Product name'
          required/>
      </PersistModal>
    );
  }

}
