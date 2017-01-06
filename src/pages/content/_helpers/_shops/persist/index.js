import React, { Component, PropTypes } from 'react';
import { reduxForm, Field } from 'redux-form/immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Radium from 'radium';
import SelectInput from '../../../../_common/inputs/selectInput';
import PersistModal from '../../../../_common/components/persistModal';
import localized from '../../../../_common/decorators/localized';

/* eslint-disable react/no-set-state */

function validate (values, { t }) {
  const validationErrors = {};
  const { shopId } = values.toJS();
  if (!shopId) { validationErrors.shopId = t('common.errors.required'); }
  // Done
  return validationErrors;
}
@localized
@reduxForm({
  form: 'shop',
  validate
})
@Radium
export default class ShopModal extends Component {

  static propTypes = {
    edit: PropTypes.bool,
    error: PropTypes.any,
    handleSubmit: PropTypes.func.isRequired,
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
    this.clearPopUpMessage = :: this.clearPopUpMessage;
    this.state = {};
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
    const { edit, handleSubmit, searchShops, searchedShopIds, shopsById } = this.props;
    return (
      <PersistModal
        clearPopUpMessage={this.clearPopUpMessage}
        isOpen
        popUpObject={this.state.popUpMessage}
        submitButtonText={edit ? 'Save' : 'Add'}
        title={edit ? 'Edit Shop' : 'Add Shop'}
        onClose={this.onCloseClick}
        onSubmit={handleSubmit(this.submit)}>
        <Field
          component={SelectInput}
          first
          getItemText={(shopId) => shopsById.getIn([ shopId, 'name' ])}
          getOptions={searchShops}
          label='Shop'
          name='shopId'
          options={searchedShopIds.get('data').toArray()}
          placeholder='Shop'
          required />
      </PersistModal>
    );
  }

}
