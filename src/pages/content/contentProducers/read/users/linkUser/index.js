import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import LinkUserModal from '../../../../../_common/components/linkUserModal';
import { routerPushWithReturnTo } from '../../../../../../actions/global';
import { persistLinkUser } from './actions';
import { load } from '../list/actions';

@connect(null, (dispatch) => ({
  persistLinkUser: bindActionCreators(persistLinkUser, dispatch),
  load: bindActionCreators(load, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch)
}))
@Radium
export default class LinkUserToContentProducer extends Component {

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
    this.props.routerPushWithReturnTo({ ...this.props.location, pathname: `/content/content-producers/read/${this.props.params.id}/create/user`, query: { ...this.props.location.query, userName } });
  }

  async onSubmit (userForm) {
    const form = userForm.toJS();
    const userId = form.userId;
    const contentProducerId = this.props.params.id;
    await this.props.persistLinkUser(contentProducerId, userId);
    await this.props.load(this.props.location.query, contentProducerId);
    this.props.routerPushWithReturnTo(`/content/content-producers/read/${this.props.params.id}`, true);
  }

  render () {
    return (
      <LinkUserModal {...this.props} submitButtonText='Link user' title='Link user to a content producer' onCreateOption={this.onCreateOption} onSubmit={this.onSubmit}/>
    );
  }
}
