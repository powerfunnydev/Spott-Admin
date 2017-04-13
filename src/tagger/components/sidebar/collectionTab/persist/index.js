/* eslint-disable react/no-set-state */
import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import Radium from 'radium';
import { reduxForm, Field } from 'redux-form/immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { colors, FormSubtitle } from '../../../../../pages/_common/styles';
import CheckboxInput from '../../../../../pages/_common/inputs/checkbox';
import SelectInput from '../../../../../pages/_common/inputs/selectInput';
import TextInput from '../../../../../pages/_common/inputs/textInput';
import RadioInput from '../../../../../pages/_common/inputs/radioInput';
import PersistModal from '../../../../../pages/_common/components/persistModal';
import localized from '../../../../../pages/_common/decorators/localized';
import selector from './selector';

const linkTypes = [
  { label: 'Regular', value: 'REGULAR' },
  { label: 'Character', value: 'CHARACTER' },
  { label: 'Brand', value: 'BRAND' }
];

function validate (values, { t }) {
  const validationErrors = {};
  const { brandId, characterId, defaultLocale, linkType, locales, title } = values.toJS();
  if (linkType === 'BRAND' && !brandId) { validationErrors.brandId = t('common.errors.required'); }
  if (linkType === 'CHARACTER' && !characterId) { validationErrors.characterId = t('common.errors.required'); }
  if (!defaultLocale) { validationErrors.defaultLocale = t('common.errors.required'); }

  if (locales) {
    // Check if title is provided for all locales.
    for (const locale of locales) {
      if (!title || !title[locale]) {
        validationErrors.title = validationErrors.title || {};
        validationErrors.title[locale] = t('common.errors.required');
      }
    }
  }

  // Done
  return validationErrors;
}

@connect(selector)
@localized
@reduxForm({
  form: 'taggerCollection',
  validate
})
@Radium
export default class CollectionModal extends Component {

  static propTypes = {
    basedOnDefaultLocale: PropTypes.object,
    brandsById: ImmutablePropTypes.map.isRequired,
    charactersById: ImmutablePropTypes.map.isRequired,
    collection: PropTypes.object,
    countTitles: PropTypes.number.isRequired,
    currentLinkType: PropTypes.string,
    currentLocale: PropTypes.string.isRequired,
    // The selected default locale or 'en' (English).
    defaultLocale: PropTypes.string.isRequired,
    edit: PropTypes.bool,
    error: PropTypes.any,
    handleSubmit: PropTypes.func.isRequired,
    // Redux-form function which sets the initial values of the form.
    initialize: PropTypes.func.isRequired,
    localeNames: ImmutablePropTypes.map.isRequired,
    recurring: PropTypes.bool,
    searchBrands: PropTypes.func.isRequired,
    searchCharacters: PropTypes.func.isRequired,
    searchedBrandIds: ImmutablePropTypes.map.isRequired,
    searchedCharacterIds: ImmutablePropTypes.map.isRequired,
    title: PropTypes.string,
    totalTitles: PropTypes.number.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onCloseClick = ::this.onCloseClick;
    this.submit = ::this.submit;
    this.clearPopUpMessage = :: this.clearPopUpMessage;
    this.state = { translate: false };
  }

  componentDidMount () {
    const { collection, currentLocale, initialize, localeNames } = this.props;

    if (collection) {
      console.warn('COLL', collection);
      for (const [ locale ] of localeNames) {
        console.warn('locale', locale);
        if (typeof collection.basedOnDefaultLocale[locale] === 'undefined') {
          collection.basedOnDefaultLocale[locale] = true;
        }
      }
      initialize({
        ...collection,
        locales: localeNames.keySeq()
      });
    } else {
      const basedOnDefaultLocale = {};
      for (const [ locale ] of localeNames) {
        basedOnDefaultLocale[locale] = locale !== currentLocale;
      }
      initialize({
        basedOnDefaultLocale,
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
    basedOnDefaultLocale: {
      paddingBottom: '0.438em'
    },
    alignRight: {
      fontSize: '0.688em',
      float: 'right',
      marginTop: 5
    },
    translate: {
      color: colors.primaryBlue
    },
    translateFrom: {
      color: colors.lightGray3,
      fontSize: '0.75em',
      fontStyle: 'italic'
    },
    titleCounters: {
      color: colors.darkGray2
    }
  };

  render () {
    const styles = this.constructor.styles;
    const {
      basedOnDefaultLocale, brandsById, charactersById, countTitles, currentLinkType,
      defaultLocale, edit, handleSubmit, localeNames, recurring, searchBrands,
      searchCharacters, searchedBrandIds, searchedCharacterIds, title, totalTitles
    } = this.props;
    return (
      <div>
        <PersistModal
          clearPopUpMessage={this.clearPopUpMessage}
          isOpen={!this.state.translate}
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
          <Field
            component={TextInput}
            label='Title'
            name={`title.${defaultLocale}`}
            placeholder='Title'
            required/>
          <span style={styles.alignRight}>
            <a href='#' style={styles.translate} onClick={(e) => {
              e.preventDefault();
              this.setState({ ...this.state, translate: true });
            }}>
              Translate
            </a>
            &nbsp;<span style={styles.titleCounters}>({countTitles}/{totalTitles})</span>
          </span>

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
          <Field
            component={CheckboxInput}
            disabled={!recurring}
            first
            label='Copy products in collection too'
            name='recurringEntries'
            style={{ paddingTop: '0.625em' }}/>
        </PersistModal>
        <PersistModal
          clearPopUpMessage={this.clearPopUpMessage}
          isOpen={this.state.translate}
          popUpObject={this.state.popUpMessage}
          submitButtonText='Save'
          title='Translate'
          onClose={(e) => this.setState({ ...this.state, translate: false })}
          onSubmit={(e) => {
            e.preventDefault();
            this.setState({ ...this.state, translate: false });
          }}>
          <FormSubtitle style={{ paddingTop: 0 }}>Translate from {localeNames.get(defaultLocale)}</FormSubtitle>
          <span style={styles.translateFrom}>“{title}”</span>
          {localeNames.filter((locale, key) => key !== defaultLocale).map((locale, key, index) => (
            <Field
              component={TextInput}
              content={
                <Field
                  component={CheckboxInput}
                  first
                  label={`Copy from ${localeNames.get(defaultLocale)}`}
                  name={`basedOnDefaultLocale.${key}`}
                  style={styles.basedOnDefaultLocale} />}
              disabled={basedOnDefaultLocale && basedOnDefaultLocale.get(key)}
              first={index === 0}
              key={key}
              label={locale}
              name={`title.${key}`}
              placeholder={`Title (${locale})`}
              required/>
          )).toArray()}
        </PersistModal>
      </div>
    );
  }

}
