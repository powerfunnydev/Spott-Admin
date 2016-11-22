import React, { Component, PropTypes } from 'react';
import { reduxForm, Field, SubmissionError } from 'redux-form/immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormSubtitle } from '../../../_common/styles';
import TextInput from '../../../_common/inputs/textInput';
import localized from '../../../_common/localized';
import CreateModal from '../../../_common/createModal';
import { load } from '../list/actions';
import * as actions from './actions';
import { routerPushWithReturnTo } from '../../../../actions/global';
import selector from './selector';
import SelectInput from '../../../_common/inputs/selectInput';
import { FETCHING } from '../../../../constants/statusTypes';

function validate (values, { t }) {
  const validationErrors = {};
  const { name } = values.toJS();
  if (!name) { validationErrors.name = t('common.errors.required'); }
  // Done
  return validationErrors;
}

@localized
@connect(selector, (dispatch) => ({
  load: bindActionCreators(load, dispatch),
  submit: bindActionCreators(actions.submit, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch),
  searchSeriesEntries: bindActionCreators(actions.searchSeriesEntries, dispatch)
}))
@reduxForm({
  form: 'seasonsCreateEntry',
  validate
})
@Radium
export default class CreateSeasonEntryModal extends Component {

  static propTypes = {
    change: PropTypes.func.isRequired,
    currentSeriesEntryId: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    error: PropTypes.any,
    handleSubmit: PropTypes.func.isRequired,
    initialize: PropTypes.func.isRequired,
    load: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    routerPushWithReturnTo: PropTypes.func.isRequired,
    searchSeriesEntries: PropTypes.func.isRequired,
    searchedSeriesEntryIds: ImmutablePropTypes.map.isRequired,
    seriesEntriesById: ImmutablePropTypes.map.isRequired,
    submit: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onCloseClick = ::this.onCloseClick;
    this.submit = ::this.submit;
  }

  async componentWillMount () {
    if (this.props.params.seriesEntryId) {
      this.props.initialize({
        seriesEntryId: this.props.params.seriesEntryId
      });
    }
  }

  async submit (form) {
    try {
      await this.props.submit(form.toJS());
      // Load the new list of items, using the location query of the previous page.
      const location = this.props.location && this.props.location.state && this.props.location.state.returnTo;
      if (location && location.query) {
        this.props.load(location.query);
      }
      this.onCloseClick();
    } catch (error) {
      throw new SubmissionError({ _error: 'common.errors.unexpected' });
    }
  }

  onCloseClick () {
    this.props.routerPushWithReturnTo('content/seasons', true);
  }

  render () {
    const { currentSeriesEntryId, searchSeriesEntries, seriesEntriesById, searchedSeriesEntryIds, handleSubmit } = this.props;
    console.log('currentSeriesEntryId', currentSeriesEntryId);
    return (
      <CreateModal isOpen title='Create Season Entry' onClose={this.onCloseClick} onSubmit={handleSubmit(this.submit)}>
        <FormSubtitle first>Content</FormSubtitle>
        <Field
          component={SelectInput}
          getItemText={(id) => seriesEntriesById.getIn([ id, 'title' ])}
          getOptions={searchSeriesEntries}
          isLoading={searchedSeriesEntryIds.get('_status') === FETCHING}
          label='Serie'
          name='seriesEntryId'
          options={searchedSeriesEntryIds.get('data').toJS()}
          placeholder='Title serie'
          onChange={() => {
            this.props.dispatch(this.props.change('title', null));
          }} />
        { currentSeriesEntryId && <Field
          component={TextInput}
          label='Title'
          name='title'
          placeholder='Title season'
          required/>}
      </CreateModal>
    );
  }

}
