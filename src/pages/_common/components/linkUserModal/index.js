import React, { Component, PropTypes } from 'react';
import { reduxForm, Field } from 'redux-form/immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FETCHING } from '../../../../constants/statusTypes';
import { FormSubtitle } from '../../styles';
import localized from '../../decorators/localized';
import PersistModal from '../persistModal';
import * as actions from './actions';
import SelectInput from '../../inputs/selectInput';
import selector from './selector';
import { routerPushWithReturnTo } from '../../../../actions/global';

function validate (values, { t }) {
  const validationErrors = {};
  const { userId } = values.toJS();
  if (!userId) { validationErrors.userId = t('common.errors.required'); }
  // Done
  return validationErrors;
}

@localized
@connect(selector, (dispatch) => ({
  searchUsers: bindActionCreators(actions.searchUsers, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch)
}))
@reduxForm({
  form: 'linkUserModal',
  validate
})

@Radium
export default class LinkUser extends Component {

  static propTypes = {
    error: PropTypes.any,
    handleSubmit: PropTypes.func.isRequired,
    initialize: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    routerPushWithReturnTo: PropTypes.func.isRequired,
    searchUsers: PropTypes.func.isRequired,
    searchedUserIds: ImmutablePropTypes.map.isRequired,
    submitButtonText: PropTypes.string,
    t: PropTypes.func.isRequired,
    title: PropTypes.string,
    usersById: ImmutablePropTypes.map.isRequired,
    onCreateOption: PropTypes.func,
    onSubmit: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onCloseClick = ::this.onCloseClick;
  }

  onCloseClick () {
    this.props.routerPushWithReturnTo('content/users', true);
  }

  render () {
    const { title, submitButtonText, usersById, handleSubmit, searchUsers, searchedUserIds, onCreateOption, onSubmit } = this.props;
    return (
      <PersistModal isOpen submitButtonText={submitButtonText} title={title} onClose={this.onCloseClick} onSubmit={handleSubmit(onSubmit)}>
        <FormSubtitle first>Content</FormSubtitle>
        <Field
          component={SelectInput}
          getItemText={(id) => usersById.getIn([ id, 'userName' ])}
          getOptions={searchUsers}
          isLoading={searchedUserIds.get('_status') === FETCHING}
          label='User'
          name='userId'
          options={searchedUserIds.get('data').toJS()}
          placeholder='User'
          onCreateOption={onCreateOption}/>
      </PersistModal>
    );
  }

}
