import React, { Component, PropTypes } from 'react';
import { reduxForm, Field, SubmissionError } from 'redux-form/immutable';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormSubtitle } from '../../../_common/styles';
import TextInput from '../../../_common/inputs/textInput';
import SelectInput from '../../../_common/inputs/selectInput';
import localized from '../../../_common/decorators/localized';
import PersistModal from '../../../_common/components/persistModal';
import { load as loadList } from '../list/actions';
import ImmutablePropTypes from 'react-immutable-proptypes';
import * as actions from './actions';
import { routerPushWithReturnTo } from '../../../../actions/global';
import selector from './selector';
import { FETCHING } from '../../../../constants/statusTypes';

function validate (values, { t }) {
  const validationErrors = {};
  const { defaultLocale, name, personId } = values.toJS();
  if (!defaultLocale) { validationErrors.defaultLocale = t('common.errors.required'); }
  if (!name) { validationErrors.name = t('common.errors.required'); }
  if (!personId) { validationErrors.personId = t('common.errors.required'); }
  // Done
  return validationErrors;
}

@localized
@connect(selector, (dispatch) => ({
  load: bindActionCreators(loadList, dispatch),
  searchPersons: bindActionCreators(actions.searchPersons, dispatch),
  submit: bindActionCreators(actions.submit, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch)
}))
@reduxForm({
  form: 'characterCreate',
  validate
})
@Radium
export default class CreateCharacterModal extends Component {

  static propTypes = {
    change: PropTypes.func.isRequired,
    currentLocale: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    error: PropTypes.any,
    handleSubmit: PropTypes.func.isRequired,
    initialize: PropTypes.func.isRequired,
    load: PropTypes.func.isRequired,
    localeNames: ImmutablePropTypes.map.isRequired,
    location: PropTypes.object.isRequired,
    personsById: ImmutablePropTypes.map.isRequired,
    reset: PropTypes.func.isRequired,
    routerPushWithReturnTo: PropTypes.func.isRequired,
    searchPersons: PropTypes.func.isRequired,
    searchedPersonIds: ImmutablePropTypes.map.isRequired,
    submit: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onCloseClick = ::this.onCloseClick;
    this.submit = ::this.submit;
    this.onCreateOption = ::this.onCreateOption;
  }

  componentWillMount () {
    this.props.initialize({
      defaultLocale: this.props.currentLocale
    });
  }
  async submit (form) {
    try {
      const { load, location, submit, dispatch, change, reset } = this.props;
      await submit(form.toJS());
      const createAnother = form.get('createAnother');
      // Load the new list of items, using the location query of the previous page.
      const loc = location && location.state && location.state.returnTo;
      if (loc && loc.query) {
        load(loc.query);
      }
      if (createAnother) {
        await dispatch(reset());
        await dispatch(change('createAnother', true));
      } else {
        this.onCloseClick();
      }
    } catch (error) {
      throw new SubmissionError({ _error: 'common.errors.unexpected' });
    }
  }

  onCreateOption (fullName) {
    this.props.routerPushWithReturnTo({ pathname: '/content/persons/create', query: { ...this.props.location.query, fullName } });
  }

  onCloseClick () {
    this.props.routerPushWithReturnTo('content/characters', true);
  }

  render () {
    const { personsById, handleSubmit, localeNames, searchPersons, searchedPersonIds } = this.props;
    return (
      <PersistModal createAnother isOpen title='Create Character' onClose={this.onCloseClick} onSubmit={handleSubmit(this.submit)}>
        <FormSubtitle first>Content</FormSubtitle>
        <Field
          component={SelectInput}
          filter={(option, filter) => {
            return option && filter ? localeNames.get(option.value).toLowerCase().indexOf(filter.toLowerCase()) !== -1 : true;
          }}
          getItemText={(language) => localeNames.get(language)}
          getOptions={(language) => localeNames.keySeq().toArray()}
          label='Default language'
          name='defaultLocale'
          options={localeNames.keySeq().toArray()}
          placeholder='Default language'/>
        <Field
          component={TextInput}
          label='Character name'
          name='name'
          placeholder='Character name'
          required/>
        <Field
          component={SelectInput}
          getItemText={(id) => personsById.getIn([ id, 'fullName' ])}
          getOptions={searchPersons}
          isLoading={searchedPersonIds.get('_status') === FETCHING}
          label='Person'
          name='personId'
          options={searchedPersonIds.get('data').toJS()}
          placeholder='Person name'
          required
          onCreateOption={this.onCreateOption}/>
      </PersistModal>
    );
  }

}
