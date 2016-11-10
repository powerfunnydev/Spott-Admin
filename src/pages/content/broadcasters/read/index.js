import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Header from '../../../app/header';
import { Root, Container, colors } from '../../../_common/styles';
import * as actions from './actions';
import SpecificHeader from '../../header';
import selector from './selector';
import EntityDetails from '../../../_common/entityDetails';
import * as listActions from '../list/broadcasters/actions';
import { routerPushWithReturnTo } from '../../../../actions/global';
import BreadCrumbs from '../../../_common/breadCrumbs';
import Line from '../../../_common/components/line';
import BroadcastChannelList from './broadcastChannels';
import UserList from './users';
import { Tabs, Tab } from '../../../_common/components/formTabs';
import { generalStyles } from '../../../_common/components/table/index';

/* eslint-disable no-alert */

@connect(selector, (dispatch) => ({
  deleteBroadcaster: bindActionCreators(listActions.deleteBroadcaster, dispatch),
  loadBroadcaster: bindActionCreators(actions.loadBroadcaster, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch)
}))
@Radium
export default class ReadBroadcaster extends Component {

  static propTypes = {
    children: PropTypes.node,
    currentBroadcaster: PropTypes.object.isRequired,
    deleteBroadcaster: PropTypes.func.isRequired,
    error: PropTypes.any,
    loadBroadcaster: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    routerPushWithReturnTo: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.redirect = ::this.redirect;
    this.onClickNewEntry = :: this.onClickNewEntry;
  }

  async componentWillMount () {
    if (this.props.params.id) {
      await this.props.loadBroadcaster(this.props.params.id);
    }
  }

  getName (broadcaster) {
    return broadcaster.get('name');
  }

  redirect () {
    this.props.routerPushWithReturnTo('content/broadcasters', true);
  }

  onClickNewEntry (e) {
    e.preventDefault();
    const broadcasterId = this.props.params.id;
    if (broadcasterId) {
      this.props.routerPushWithReturnTo(`content/broadcasters/read/${broadcasterId}/create/broadcast-channel`);
    }
  }

  static styles= {
    table: {
      backgroundColor: colors.lightGray4,
      paddingTop: '20px'
    }
  }

  render () {
    const { children, currentBroadcaster,
       location, deleteBroadcaster } = this.props;
    const { styles } = this.constructor;
    return (
      <Root>
        <Header currentLocation={location} hideHomePageLinks />
        <SpecificHeader/>
        <BreadCrumbs hierarchy={[ { title: 'List', url: '/content/broadcasters' }, { title: currentBroadcaster.get('name'), url: location.pathname } ]}/>
        <Container>
          {currentBroadcaster.get('_status') === 'loaded' && currentBroadcaster &&
            <EntityDetails image={currentBroadcaster.get('logo') && currentBroadcaster.getIn([ 'logo', 'url' ])} title={currentBroadcaster.getIn([ 'name' ])}
              onEdit={() => { this.props.routerPushWithReturnTo(`content/broadcasters/edit/${currentBroadcaster.getIn([ 'id' ])}`); }}
              onRemove={async () => { await deleteBroadcaster(currentBroadcaster.getIn([ 'id' ])); this.redirect(); }}/>}
        </Container>
        <Line/>
        <div style={[ generalStyles.fillPage, styles.table ]}>
          <Container>
            <Tabs>
              <Tab title='Broadcast Channels'>
                <BroadcastChannelList {...this.props}/>
              </Tab>
              <Tab title='Users'>
                <UserList {...this.props}/>
              </Tab>
            </Tabs>
          </Container>
        </div>
        <Line/>
        {children}
      </Root>
    );
  }

}
