import React, { Component, PropTypes } from 'react';
import { reduxForm, Field, SubmissionError } from 'redux-form/immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Radium from 'radium';
import { connect } from 'react-redux';
import selector from './selector';
import * as actions from './actions';
import { bindActionCreators } from 'redux';
import TextInput from '../../../../../_common/inputs/textInput';
import CheckboxInput from '../../../../../_common/inputs/checkbox';
import PersistModal from '../../../../../_common/components/persistModal';
import localized from '../../../../../_common/decorators/localized';

function validate (values, { t }) {
  const validationErrors = {};
  const nameErrors = {};
  const { nameCopy, name } = values.toJS();
  if (name && !name.en) { nameErrors.en = t('common.errors.required'); }
  if (nameCopy && name && !nameCopy.nl && !name.nl) { nameErrors.nl = t('common.errors.required'); }
  if (nameCopy && name && !nameCopy.fr && !name.fr) { nameErrors.fr = t('common.errors.required'); }

  validationErrors.name = nameErrors;
  // Done
  return validationErrors;
}

@localized
@connect(selector, (dispatch) => ({
  fetchMediumCategory: bindActionCreators(actions.fetchMediumCategory, dispatch)
}))
@reduxForm({
  form: 'mediumCategory',
  validate
})
@Radium
export default class MediumCategoryModal extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    edit: PropTypes.bool,
    error: PropTypes.any,
    handleSubmit: PropTypes.func.isRequired,
    localeNames: ImmutablePropTypes.map.isRequired,
    nameCopy: ImmutablePropTypes.map,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onCloseClick = ::this.onCloseClick;
    this.submit = ::this.submit;
  }

  async componentWillMount () {
    const nameCopyLocales = [ 'fr', 'nl' ];
    // When we want to edit a mediumCategory, we need to fetch the full version first.
    if (this.props.mediumCategoryId) {
      const { id, name, locales } = await this.props.fetchMediumCategory({ mediumCategoryId: this.props.mediumCategoryId });
      const nameCopy = {};
      nameCopyLocales.map((locale) => {
        nameCopy[locale] = locales.indexOf(locale) === -1;
      });
      this.props.initialize({
        defaultLocale: 'en',
        mediumCategoryId: id,
        name,
        nameCopy
      });
    } else {
      this.props.initialize({
        nameCopy: { fr: true, nl: true }
      });
    }
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
    customTitle: {
      paddingBottom: '0.438em'
    }
  }

  render () {
    const { edit, handleSubmit, nameCopy } = this.props;
    const { styles } = this.constructor;
    return (
      <PersistModal isOpen submitButtonText={edit ? 'Save' : 'Add'} title={edit ? 'Edit Medium Category' : 'Add Medium Category'} onClose={this.onCloseClick} onSubmit={handleSubmit(this.submit)}>
        <Field
          component={TextInput}
          label='English'
          name='name.en'
          placeholder='E.g. Action'
          required />
        <Field
          component={TextInput}
          content={
            <Field
              component={CheckboxInput}
              first
              label='Copy from English'
              name='nameCopy.nl'
              style={styles.customTitle} />}
          disabled={nameCopy && nameCopy.get('nl')}
          label='Dutch'
          name='name.nl'
          placeholder='E.g. Actie' />
        <Field
          component={TextInput}
          content={
            <Field
              component={CheckboxInput}
              first
              label='Copy from English'
              name='nameCopy.fr'
              style={styles.customTitle} />}
          disabled={nameCopy && nameCopy.get('fr')}
          label='French'
          name='name.fr'
          placeholder='E.g. Action' />
      </PersistModal>
    );
  }

}
