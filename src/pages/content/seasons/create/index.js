import React, { Component, PropTypes } from 'react';
import { reduxForm, Field, SubmissionError } from 'redux-form/immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormSubtitle } from '../../../_common/styles';
import TextInput from '../../../_common/inputs/textInput';
import NumberInput from '../../../_common/inputs/numberInput';
import CheckboxInput from '../../../_common/inputs/checkbox';
import localized from '../../../_common/decorators/localized';
import PersistModal from '../../../_common/components/persistModal';
import { loadSeasons } from '../../series/read/seasons/actions';
import * as actions from './actions';
import { routerPushWithReturnTo } from '../../../../actions/global';
import selector from './selector';
import SelectInput from '../../../_common/inputs/selectInput';
import { FETCHING } from '../../../../constants/statusTypes';

function validate (values, { t }) {
  const validationErrors = {};
  const { defaultLocale, hasTitle, number, seriesEntryId, title } = values.toJS();
  if (!seriesEntryId) { validationErrors.seriesEntryId = t('common.errors.required'); }
  if (!defaultLocale) { validationErrors.defaultLocale = t('common.errors.required'); }
  if (!number || number < 1) { validationErrors.number = t('common.errors.required'); }
  if (hasTitle && !title) { validationErrors.title = t('common.errors.required'); }
  // Done
  return validationErrors;
}

@localized
@connect(selector, (dispatch) => ({
  loadSeasons: bindActionCreators(loadSeasons, dispatch),
  submit: bindActionCreators(actions.submit, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch),
  searchSeriesEntries: bindActionCreators(actions.searchSeriesEntries, dispatch)
}))
@reduxForm({
  form: 'seasonCreate',
  validate
})
@Radium
export default class CreateSeasonEntryModal extends Component {

  static propTypes = {
    change: PropTypes.func.isRequired,
    currentLocale: PropTypes.string.isRequired,
    currentSeriesEntryId: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    error: PropTypes.any,
    handleSubmit: PropTypes.func.isRequired,
    hasTitle: PropTypes.bool,
    initialize: PropTypes.func.isRequired,
    loadSeasons: PropTypes.func.isRequired,
    localeNames: ImmutablePropTypes.map.isRequired,
    location: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    reset: PropTypes.func.isRequired,
    routerPushWithReturnTo: PropTypes.func.isRequired,
    searchSeriesEntries: PropTypes.func.isRequired,
    searchedSeriesEntryIds: ImmutablePropTypes.map.isRequired,
    seriesEntriesById: ImmutablePropTypes.map.isRequired,
    submit: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    untouch: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onCloseClick = ::this.onCloseClick;
    this.submit = ::this.submit;
  }

  async componentWillMount () {
    this.props.initialize({
      defaultLocale: this.props.currentLocale,
      hasTitle: false,
      seriesEntryId: this.props.params.seriesEntryId
    });
  }

  async submit (form) {
    try {
      const { seriesEntryId } = this.props.params;
      const { change, dispatch, location, submit, untouch } = this.props;
      await submit(form.toJS());
      const createAnother = form.get('createAnother');
      // Load the new list of items, using the location query of the previous page.
      const loc = location && location.state && location.state.returnTo;
      // if we are in the read page of a seriesEntry
      if (seriesEntryId && loc && loc.query) {
        this.props.loadSeasons(loc.query, seriesEntryId);
      }
      if (createAnother) {
        // If we create another season, set the next season number
        dispatch(change('number', parseInt(form.get('number'), 10) + 1));
        // and reset the title.
        dispatch(change('title', null));
        dispatch(untouch('defaultLocale', 'seriesEntryId', 'number', 'hasTitle', 'title'));
      } else {
        this.onCloseClick();
      }
    } catch (error) {
      throw new SubmissionError({ _error: 'common.errors.unexpected' });
    }
  }

  onCloseClick () {
    this.props.routerPushWithReturnTo('content/seasons', true);
  }

  static styles = {
    customTitle: {
      paddingBottom: '0.438em'
    },
    titleLabel: {
      paddingBottom: '0.7em'
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { hasTitle, localeNames, currentSeriesEntryId, searchSeriesEntries, seriesEntriesById, searchedSeriesEntryIds, handleSubmit } = this.props;
    return (
      <PersistModal createAnother isOpen title='Create Season Entry'
        onClose={this.onCloseClick} onSubmit={handleSubmit(this.submit)}>
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
          component={SelectInput}
          getItemText={(id) => seriesEntriesById.getIn([ id, 'title' ])}
          getOptions={searchSeriesEntries}
          isLoading={searchedSeriesEntryIds.get('_status') === FETCHING}
          label='Series title'
          name='seriesEntryId'
          options={searchedSeriesEntryIds.get('data').toJS()}
          placeholder='Series title'
          onChange={() => {
            this.props.dispatch(this.props.change('title', null));
          }} />
        {currentSeriesEntryId &&
          <Field
            component={NumberInput}
            label='Season number'
            min={1}
            name='number'
            placeholder='Season number'
            required />}
        {currentSeriesEntryId &&
          <Field
            component={TextInput}
            content={
              <Field
                component={CheckboxInput}
                first
                label='Custom title'
                name='hasTitle'
                style={styles.customTitle} />}
            disabled={!hasTitle}
            label='Season title'
            labelStyle={styles.titleLabel}
            name='title'
            placeholder='Season title'
            required />}
      </PersistModal>
    );
  }

}
