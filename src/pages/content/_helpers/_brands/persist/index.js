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
  const { brandId } = values.toJS();
  if (!brandId) { validationErrors.brandId = t('common.errors.required'); }
  // Done
  return validationErrors;
}
@localized
@reduxForm({
  form: 'brand',
  validate
})
@Radium
export default class BrandModal extends Component {

  static propTypes = {
    brandsById: ImmutablePropTypes.map.isRequired,
    edit: PropTypes.bool,
    error: PropTypes.any,
    handleSubmit: PropTypes.func.isRequired,
    searchBrands: PropTypes.func.isRequired,
    searchedBrandIds: ImmutablePropTypes.map.isRequired,
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
    const { edit, handleSubmit, searchBrands, searchedBrandIds, brandsById } = this.props;
    return (
      <PersistModal
        clearPopUpMessage={this.clearPopUpMessage}
        isOpen
        popUpObject={this.state.popUpMessage}
        submitButtonText={edit ? 'Save' : 'Add'}
        title={edit ? 'Edit Brand' : 'Add Brand'}
        onClose={this.onCloseClick}
        onSubmit={handleSubmit(this.submit)}>
        <Field
          component={SelectInput}
          first
          getItemImage={(id) => brandsById.getIn([ id, 'logo', 'url' ])}
          getItemText={(id) => brandsById.getIn([ id, 'name' ])}
          getOptions={searchBrands}
          label='Brand'
          name='brandId'
          options={searchedBrandIds.get('data').toArray()}
          placeholder='Brand'
          required />
      </PersistModal>
    );
  }

}
