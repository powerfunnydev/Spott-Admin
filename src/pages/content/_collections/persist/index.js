import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { reduxForm, Field } from 'redux-form/immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { FormSubtitle } from '../../../_common/styles';
import CheckboxInput from '../../../_common/inputs/checkbox';
import SelectInput from '../../../_common/inputs/selectInput';
import TextInput from '../../../_common/inputs/textInput';
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
    collection: ImmutablePropTypes.map,
    currentLinkType: PropTypes.string,
    currentLocale: PropTypes.string.isRequired,
    edit: PropTypes.bool,
    error: PropTypes.any,
    handleSubmit: PropTypes.func.isRequired,
    // Redux-form function which sets the initial values of the form.
    initialize: PropTypes.func.isRequired,
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

  componentDidMount () {
    const { collection, currentLocale, initialize, localeNames } = this.props;

    if (collection) {
      console.warn('EDIT', collection);
    } else {
      initialize({
        defaultLocale: currentLocale,
        linkType: 'REGULAR',
        locales: localeNames.keySeq()
      });
    }
  }

  clearPopUpMessage () {
    this.setState({});
  }

  async submit (form) {
    try {
      console.warn('FORM', form.toJS());
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
      brandsById, charactersById, currentLinkType, edit, handleSubmit, localeNames, searchBrands,
      searchCharacters, searchedBrandIds, searchedCharacterIds
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
        {localeNames.keySeq().map((language) => (
          <Field
            component={TextInput}
            key={language}
            label={`Title (${language})`}
            name={`title.${language}`}
            placeholder={`Title (${language})`}/>
        ))}
        <FormSubtitle style={{ paddingTop: '1.5em' }}>Collection type</FormSubtitle>
        <Field
          component={RadioInput}
          first
          label='Collection type'
          name='linkType'
          options={linkTypes}
          style={{ display: 'flex' }}/>
        {currentLinkType === 'BRAND' &&
          <Field
            component={SelectInput}
            getItemText={(brandId) => brandsById.getIn([ brandId, 'name' ])}
            getOptions={searchBrands}
            label='Link brand'
            name='brandId'
            options={searchedBrandIds.get('data').toArray()}
            placeholder='Brand'
            required/>}
        {currentLinkType === 'CHARACTER' &&
           <Field
             component={SelectInput}
             getItemText={(characterId) => charactersById.getIn([ characterId, 'name' ])}
             getOptions={searchCharacters}
             label='Link cast member'
             name='characterId'
             options={searchedCharacterIds.get('data').toArray()}
             placeholder='Character'
             required/>}
        <FormSubtitle style={{ paddingTop: '1.5em' }}>Recurring collection?</FormSubtitle>
        <Field
          component={CheckboxInput}
          first
          label='This collection will be used in later episodes'
          name='recurring'
          style={{ paddingTop: '0.625em' }}/>
      </PersistModal>
    );
  }

}
