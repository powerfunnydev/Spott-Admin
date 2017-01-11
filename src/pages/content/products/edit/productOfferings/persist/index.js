import React, { Component, PropTypes } from 'react';
import { reduxForm, Field, SubmissionError } from 'redux-form/immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TextInput from '../../../../../_common/inputs/textInput';
import SelectInput from '../../../../../_common/inputs/selectInput';
import NumberInput from '../../../../../_common/inputs/numberInput';
import PersistModal from '../../../../../_common/components/persistModal';
import localized from '../../../../../_common/decorators/localized';
import selector from './selector';
import * as actions from './actions';
import { FETCHING } from '../../../../../../constants/statusTypes';

function validate (values, { t }) {
  const validationErrors = {};
  const { amount, buyUrl, currency, locale, productUrl, shopId } = values.toJS();

  if (!amount) { validationErrors.amount = t('common.errors.required'); }
  if (!currency) { validationErrors.currency = t('common.errors.required'); }
  if (!locale) { validationErrors.locale = t('common.errors.required'); }
  if (!productUrl) { validationErrors.productUrl = t('common.errors.required'); }
  if (!shopId) { validationErrors.shopId = t('common.errors.required'); }

  if (buyUrl && !/^(ftp|http|https):\/\/[^ "]+$/.test(buyUrl)) {
    validationErrors.buyUrl = 'No valid url.';
  }
  if (productUrl && !/^(ftp|http|https):\/\/[^ "]+$/.test(productUrl)) {
    validationErrors.productUrl = 'No valid url.';
  }
  // Done
  return validationErrors;
}

@localized
@connect(selector, (dispatch) => ({
  searchShops: bindActionCreators(actions.searchShops, dispatch)
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
    searchShops: PropTypes.func.isRequired,
    searchedShopIds: ImmutablePropTypes.map.isRequired,
    shopsById: ImmutablePropTypes.map.isRequired,
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
    const { shopsById, searchShops, searchedShopIds, currencies, localeNames, edit, handleSubmit } = this.props;
    return (
      <PersistModal isOpen submitButtonText={edit ? 'Save' : 'Add'} title={edit ? 'Edit Offering' : 'Add Offering'} onClose={this.onCloseClick} onSubmit={handleSubmit(this.submit)}>
        <Field
          component={SelectInput}
          getItemText={(id) => shopsById.getIn([ id, 'name' ])}
          getOptions={searchShops}
          isLoading={searchedShopIds.get('_status') === FETCHING}
          label='Shop'
          name='shopId'
          options={searchedShopIds.get('data').toJS()}
          placeholder='Shop name'
          required/>
        <Field
          component={NumberInput}
          label='Price'
          min={0}
          name='amount'
          placeholder='Price'
          required/>
        <Field
          component={SelectInput}
          getItemText={(currencyId) => `${currencies.getIn([ currencyId, 'id' ])} - ${currencies.getIn([ currencyId, 'symbol' ])} (${currencies.getIn([ currencyId, 'description' ])})`}
          label='Currency'
          name='currency'
          options={currencies.keySeq().toArray()}
          placeholder='Currency'
          required/>
        <Field
          component={SelectInput}
          getItemText={(language) => (localeNames.get(language))}
          label= 'Locale'
          name='locale'
          options={localeNames.keySeq().toArray()}
          placeholder='Locale'
          required/>
        <Field
          component={TextInput}
          label='Product url'
          name='productUrl'
          placeholder='http://'
          required/>
        <Field
          component={TextInput}
          label='Affiliate url'
          name='buyUrl'
          placeholder='http://'/>
      </PersistModal>
    );
  }

}
