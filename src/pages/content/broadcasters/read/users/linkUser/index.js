import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import LinkUserModal from '../../../../../_common/linkUserModal';
import { routerPushWithReturnTo } from '../../../../../../actions/global';
import { persistLinkUser } from './actions';
import { load } from '../list/actions';

@connect(null, (dispatch) => ({
  persistLinkUser: bindActionCreators(persistLinkUser, dispatch),
  load: bindActionCreators(load, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch)
}))
@Radium
export default class LinkUserToBroadcaster extends Component {

  static propTypes = {
    load: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    persistLinkUser: PropTypes.func.isRequired,
    routerPushWithReturnTo: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onSubmit = ::this.onSubmit;
    this.onCreateOption = ::this.onCreateOption;
  }

  onCreateOption (userName) {
    this.props.routerPushWithReturnTo({ ...this.props.location, pathname: `/content/broadcasters/read/${this.props.params.broadcasterId}/create/user`, query: { ...this.props.location.query, userName } });
  }

  async onSubmit (userForm) {
    const { userId } = userForm.toJS();
    const broadcasterId = this.props.params.broadcasterId;
    await this.props.persistLinkUser(broadcasterId, userId);
    await this.props.load(this.props.location.query, broadcasterId);
    this.props.routerPushWithReturnTo(`/content/broadcasters/read/${broadcasterId}`, true);
  }

  render () {
    return (
      <LinkUserModal {...this.props} submitButtonText='Link user' title='Link user to a broadcaster' onCreateOption={this.onCreateOption} onSubmit={this.onSubmit}/>
    );
  }
}
