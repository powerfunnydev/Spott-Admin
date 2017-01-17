import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { reduxForm, Field } from 'redux-form/immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import SelectInput from '../../../_common/inputs/selectInput';
import RadioInput from '../../../_common/inputs/radioInput';
import PersistModal from '../../../_common/components/persistModal';
import localized from '../../../_common/decorators/localized';
import selector from './selector';

const linkTypes = [
  { label: 'Regular', value: 'REGULAR' },
  { label: 'Character', value: 'CHARACTER' },
  { label: 'Brand', value: 'BRAND' }
];

/* eslint-disable react/no-set-state */

function validate (values, { t }) {
  const validationErrors = {};
  const { brandId } = values.toJS();
  if (!brandId) { validationErrors.brandId = t('common.errors.required'); }
  // Done
  return validationErrors;
}

@connect(selector)
@localized
@reduxForm({
  form: 'collection',
  validate
})
@Radium
export default class CollectionModal extends Component {

  static propTypes = {
    brandsById: ImmutablePropTypes.map.isRequired,
    charactersById: ImmutablePropTypes.map.isRequired,
    currentLinkType: PropTypes.string,
    currentLocale: PropTypes.string.isRequired,
    edit: PropTypes.bool,
    error: PropTypes.any,
    handleSubmit: PropTypes.func.isRequired,
    localeNames: ImmutablePropTypes.map.isRequired,
    searchBrands: PropTypes.func.isRequired,
    searchCharacters: PropTypes.func.isRequired,
    searchedBrandIds: ImmutablePropTypes.map.isRequired,
    searchedCharacterIds: ImmutablePropTypes.map.isRequired,
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
    const {
      brandsById, currentLinkType, edit, handleSubmit, localeNames, searchBrands,
      searchCharacters, searchedBrandIds
    } = this.props;
    return (
      <PersistModal
        clearPopUpMessage={this.clearPopUpMessage}
        isOpen
        popUpObject={this.state.popUpMessage}
        submitButtonText={edit ? 'Save' : 'Add'}
        title={edit ? 'Edit Collection' : 'Add Collection'}
        onClose={this.onCloseClick}
        onSubmit={handleSubmit(this.submit)}>
        <Field
          component={SelectInput}
          filter={(option, filter) => {
            return option && filter ? localeNames.get(option.value).toLowerCase().indexOf(filter.toLowerCase()) !== -1 : true;
          }}
          first
          getItemText={(language) => localeNames.get(language)}
          getOptions={(language) => localeNames.keySeq().toArray()}
          label='Default language'
          name='defaultLocale'
          options={localeNames.keySeq().toArray()}
          placeholder='Default language'
          required/>
        {localeNames.map(())}
        <Field
          component={TextInput}
          label={'Title'}
        <Field
          component={RadioInput}
          label='Collection type'
          name='linkType'
          options={linkTypes}
          style={{ display: 'flex' }}/>
        {currentLinkType === 'BRAND' &&
          <Field
            component={SelectInput}
            getItemText={(brandId) => brandsById.getIn([ brandId, 'name' ])}
            getOptions={searchBrands}
            label='Brand'
            name='brandId'
            options={searchedBrandIds.get('data').toArray()}
            placeholder='Brand'
            required/>}
        {currentLinkType === 'CHARACTER' &&
           <Field
             component={SelectInput}
             getItemText={(characterId) => brandsById.getIn([ characterId, 'name' ])}
             getOptions={searchCharacters}
             label='Character'
             name='characterId'
             options={searchedBrandIds.get('data').toArray()}
             placeholder='Character'
             required/>}
      </PersistModal>
    );
  }

}
