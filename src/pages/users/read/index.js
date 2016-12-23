import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Root, Container, colors } from '../../_common/styles';
import * as actions from './actions';
import selector from './selector';
import EntityDetails from '../../_common/entityDetails';
import { routerPushWithReturnTo } from '../../../actions/global';
import BreadCrumbs from '../../_common/components/breadCrumbs';
import Line from '../../_common/components/line';
import { generalStyles } from '../../_common/components/table/index';
import * as listActions from '../list/actions';
import { SideMenu } from '../../app/sideMenu';

/* eslint-disable no-alert */

@connect(selector, (dispatch) => ({
  deleteUser: bindActionCreators(listActions.deleteUser, dispatch),
  loadUser: bindActionCreators(actions.loadUser, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch)
}))
@Radium
export default class ReadUser extends Component {

  static propTypes = {
    children: PropTypes.node,
    currentUser: PropTypes.object.isRequired,
    deleteUser: PropTypes.func.isRequired,
    error: PropTypes.any,
    loadUser: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    routerPushWithReturnTo: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.redirect = ::this.redirect;
    this.onClickNewEntry = :: this.onClickNewEntry;
    this.onChangeTab = :: this.onChangeTab;
  }

  async componentWillMount () {
    if (this.props.params.id) {
      await this.props.loadUser(this.props.params.id);
    }
  }

  getName (broadcaster) {
    return broadcaster.get('name');
  }

  redirect () {
    this.props.routerPushWithReturnTo('content/broadcasters', true);
  }

  onChangeTab (index) {
    this.props.routerPushWithReturnTo({ ...this.props.location, query: { ...this.props.location.query, tabIndex: index } });
  }

  onClickNewEntry (e) {
    e.preventDefault();
    const broadcasterId = this.props.params.id;
    if (broadcasterId) {
      this.props.routerPushWithReturnTo(`/content/broadcasters/read/${broadcasterId}/create/broadcast-channel`);
    }
  }

  static styles= {
    table: {
      backgroundColor: colors.lightGray4,
      paddingTop: '20px'
    }
  }

  render () {
    const styles = this.constructor.styles;
    const { children, currentUser, location, deleteUser } = this.props;

    return (
      <SideMenu location={location}>
        <Root>
          <BreadCrumbs
            hierarchy={[
              { title: 'Users', url: '/users' },
              { title: currentUser.get('userName'), url: location.pathname }
            ]}/>
          <Container>
            {currentUser.get('_status') === 'loaded' && currentUser &&
              <EntityDetails
                imageUrl={currentUser.get('avatar') && `${currentUser.getIn([ 'avatar', 'url' ])}?height=310&width=310`}
                subtitle={currentUser.get('email')}
                title={`${currentUser.get('firstName')} ${currentUser.get('lastName')}`}
                onEdit={() => this.props.routerPushWithReturnTo(`/users/edit/${currentUser.get('id')}`)}
                onRemove={async () => { await deleteUser(currentUser.getIn([ 'id' ])); this.redirect(); }}/>}
          </Container>
          <Line/>
          <div style={[ generalStyles.fillPage, styles.table ]} />
          <Line/>
          {children}
        </Root>
      </SideMenu>
    );
  }
}
