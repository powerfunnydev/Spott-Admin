import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Root, Container, colors } from '../../../_common/styles';
import * as actions from './actions';
import selector from './selector';
import EntityDetails from '../../../_common/entityDetails';
import * as listActions from '../list/actions';
import { routerPushWithReturnTo } from '../../../../actions/global';
import Line from '../../../_common/components/line';
import { Tabs, Tab } from '../../../_common/components/formTabs';
import { generalStyles } from '../../../_common/components/table/index';
import { SideMenu } from '../../../app/sideMenu';
import Header from '../../../app/multiFunctionalHeader';

@connect(selector, (dispatch) => ({
  deleteDatalabeltype: bindActionCreators(listActions.deleteDatalabeltype, dispatch),
  loadBroadcaster: bindActionCreators(actions.loadBroadcaster, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch)
}))
@Radium
export default class ReadBroadcaster extends Component {

  static propTypes = {
    children: PropTypes.node,
    currentBroadcaster: PropTypes.object.isRequired,
    deleteDatalabeltype: PropTypes.func.isRequired,
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
    this.onChangeTab = :: this.onChangeTab;
  }

  async componentWillMount () {
    if (this.props.params.broadcasterId) {
      await this.props.loadBroadcaster(this.props.params.broadcasterId);
    }
  }

  getName (broadcaster) {
    return broadcaster.get('name');
  }

  redirect () {
    this.props.routerPushWithReturnTo('/content/broadcasters', true);
  }

  onChangeTab (tab) {
    this.props.routerPushWithReturnTo({ ...this.props.location, query: { ...this.props.location.query, tab } });
  }

  onClickNewEntry (e) {
    e.preventDefault();
    const broadcasterId = this.props.params.broadcasterId;
    if (broadcasterId) {
      this.props.routerPushWithReturnTo(`/content/broadcasters/read/${broadcasterId}/create/broadcast-channel`);
    }
  }

  static styles= {
    table: {
      backgroundColor: colors.lightGray4,
      paddingTop: '20px'
    }
  };

  render () {
    const styles = this.constructor.styles;
    const {
      children, currentBroadcaster, deleteDatalabeltype, location, location: { query: { tab } }
    } = this.props;

    return (
      <SideMenu>
        <Root>
          <Header
            hierarchy={[
              { title: 'Broadcasters', url: '/content/broadcasters' },
              { title: currentBroadcaster.get('name'), url: location.pathname }
            ]}/>
          <Container>
            {currentBroadcaster.get('_status') === 'loaded' && currentBroadcaster &&
              <EntityDetails
                imageUrl={currentBroadcaster.get('logo') && `${currentBroadcaster.getIn([ 'logo', 'url' ])}?height=310&width=310`}
                title={currentBroadcaster.getIn([ 'name' ])}
                onEdit={() => this.props.routerPushWithReturnTo(`/content/broadcasters/edit/${currentBroadcaster.getIn([ 'id' ])}`)}
                onRemove={async () => {
                  await deleteDatalabeltype(currentBroadcaster.getIn([ 'id' ]));
                  this.redirect();
                }}/>}
          </Container>
          <Line/>
          {children}
        </Root>
      </SideMenu>
    );
  }

}
