import React, { Component, PropTypes } from 'react';
import { reduxForm, Field, SubmissionError } from 'redux-form/immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FETCHING } from '../../../../constants/statusTypes';
import { FormSubtitle } from '../../../_common/styles';
import TextInput from '../../../_common/inputs/textInput';
import localized from '../../../_common/localized';
import CreateModal from '../../../_common/createModal';
import * as actions from './actions';
import SelectInput from '../../../_common/inputs/selectInput';
import selector from './selector';
import { routerPushWithReturnTo } from '../../../../actions/global';

function validate (values, { t }) {
  const validationErrors = {};
  const { name } = values.toJS();
  if (!name) { validationErrors.name = t('common.errors.required'); }
  // Done
  return validationErrors;
}

@localized
@connect(selector, (dispatch) => ({
  loadBroadcastChannels: bindActionCreators(actions.loadBroadcastChannels, dispatch),
  searchBroadcasters: bindActionCreators(actions.searchBroadcasters, dispatch),
  submit: bindActionCreators(actions.submit, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch)
}))
@reduxForm({
  form: 'broadcastChannelsCreateEntry',
  validate
})
@Radium
export default class CreateBroadcasterEntryModal extends Component {

  static propTypes = {
    broadcastersById: ImmutablePropTypes.map.isRequired,
    error: PropTypes.any,
    handleSubmit: PropTypes.func.isRequired,
    initialize: PropTypes.func.isRequired,
    loadBroadcastChannels: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    routerPushWithReturnTo: PropTypes.func.isRequired,
    searchBroadcasters: PropTypes.func.isRequired,
    searchedBroadcasterIds: ImmutablePropTypes.map.isRequired,
    submit: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onCloseClick = ::this.onCloseClick;
    this.submit = ::this.submit;
  }

  async componentWillMount () {
    if (this.props.params.id) {
      this.props.initialize({
        broadcasterId: this.props.params.id
      });
    }
  }

  async submit (form) {
    try {
      await this.props.submit(form.toJS());
      if (this.props.params.id) {
        await this.props.loadBroadcastChannels(this.props.params.id);
      }
      this.onCloseClick();
    } catch (error) {
      throw new SubmissionError({ _error: 'common.errors.unexpected' });
    }
  }

  onCloseClick () {
    this.props.routerPushWithReturnTo(this.props.params.id && `content/broadcasters/read/${this.props.params.id}` || 'content/broadcasters', true);
  }

  render () {
    const { broadcastersById, handleSubmit, searchBroadcasters, searchedBroadcasterIds } = this.props;
    return (
      <CreateModal isOpen title='Create Broadcast Channel' onClose={this.onCloseClick} onSubmit={handleSubmit(this.submit)}>
        <FormSubtitle first>Content</FormSubtitle>
        <Field
          component={TextInput}
          label='Name'
          name='name'
          placeholder='Name Broadcast Channel'
          required/>
        <Field
          component={SelectInput}
          getItemText={(id) => broadcastersById.getIn([ id, 'name' ])}
          getOptions={searchBroadcasters}
          isLoading={searchedBroadcasterIds.get('_status') === FETCHING}
          label='Broadcaster'
          name='broadcasterId'
          options={searchedBroadcasterIds.get('data').toJS()}
          placeholder='Broadcaster'/>
      </CreateModal>
    );
  }

}
