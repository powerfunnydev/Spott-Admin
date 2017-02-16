import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { reduxForm, Field } from 'redux-form/immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { FormSubtitle } from '../../../../../_common/styles';
import SelectInput from '../../../../../_common/inputs/selectInput';
import RadioInput from '../../../../../_common/inputs/radioInput';
import PersistModal from '../../../../../_common/components/persistModal';
import localized from '../../../../../_common/decorators/localized';
import { slowdown } from '../../../../../../utils';

const relevanceTypes = [
  { label: 'Exact', value: 'EXACT' },
  { label: 'Medium', value: 'MEDIUM' },
  { label: 'Low', value: 'LOW' }
];

/* eslint-disable react/no-set-state */

function validate (values, { t }) {
  const validationErrors = {};
  const { productId } = values.toJS();
  if (!productId) { validationErrors.productId = t('common.errors.required'); }
  // Done
  return validationErrors;
}

@localized
@reduxForm({
  form: 'collectionItem',
  validate
})
@Radium
export default class CollectionItemModal extends Component {

  static propTypes = {
    collectionItem: PropTypes.object,
    edit: PropTypes.bool,
    error: PropTypes.any,
    handleSubmit: PropTypes.func.isRequired,
    // Redux-form function which sets the initial values of the form.
    initialize: PropTypes.func.isRequired,
    productsById: ImmutablePropTypes.map.isRequired,
    searchProducts: PropTypes.func.isRequired,
    searchedProductIds: ImmutablePropTypes.map.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onCloseClick = ::this.onCloseClick;
    this.searchProducts = slowdown(props.searchProducts, 300);
    this.submit = ::this.submit;
    this.clearPopUpMessage = :: this.clearPopUpMessage;
    this.state = {};
  }

  componentDidMount () {
    const { collectionItem, initialize } = this.props;
    initialize(collectionItem);
  }

  clearPopUpMessage () {
    this.setState({});
  }

  async submit (form) {
    try {
      await this.props.onSubmit(form.toJS());
      this.onCloseClick();
    } catch (error) {
      if (error.name === 'BadRequestError') {
        this.setState({ popUpMessage: { message: error.body.message, type: 'info' } });
      }
    }
  }

  onCloseClick () {
    this.props.onClose();
  }

  static styles = {
    col2: {
      display: 'flex',
      flexDirection: 'row'
    }
  };

  render () {
    // const { styles } = this.constructor;
    const {
      edit, handleSubmit, productsById, searchProducts, searchedProductIds
    } = this.props;
    return (
      <PersistModal
        clearPopUpMessage={this.clearPopUpMessage}
        isOpen
        popUpObject={this.state.popUpMessage}
        submitButtonText={edit ? 'Save' : 'Add'}
        title={edit ? 'Edit Product' : 'Add Product'}
        onClose={this.onCloseClick}
        onSubmit={handleSubmit(this.submit)}>
        <Field
          component={SelectInput}
          first
          getItemText={(productId) => productsById.getIn([ productId, 'shortName' ])}
          getOptions={this.searchProducts}
          label='Product'
          name='productId'
          options={searchedProductIds.get('data').toArray()}
          placeholder='Search for products'
          required/>
        <FormSubtitle style={{ paddingTop: '1.5em' }}>Match indication</FormSubtitle>
        <Field
          component={RadioInput}
          first
          name='relevance'
          options={relevanceTypes}
          optionsStyle={{ display: 'flex' }}/>
      </PersistModal>
    );
  }

}
