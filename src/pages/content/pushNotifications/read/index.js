import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Root, Container, colors } from '../../../_common/styles';
import * as actions from './actions';
import selector from './selector';
import EntityDetails from '../../../_common/entityDetails';
import * as listActions from '../list/actions';
import { routerPushWithReturnTo } from '../../../../actions/global';
import Line from '../../../_common/components/line';
import { generalStyles } from '../../../_common/components/table/index';
import { Tabs, Tab } from '../../../_common/components/formTabs';
import { SideMenu } from '../../../app/sideMenu';
import Header from '../../../app/multiFunctionalHeader';
import Statistics from '../../../_common/statistics';
import Section from '../../../_common/components/section';
import moment from 'moment';
/* eslint-disable no-alert */

@connect(selector, (dispatch) => ({
  deletePushNotification: bindActionCreators(listActions.deletePushNotification, dispatch),
  loadPushNotification: bindActionCreators(actions.loadPushNotification, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch)
}))
@Radium
export default class ReadPushNotification extends Component {

  static propTypes = {
    children: PropTypes.node,
    currentPushNotification: ImmutablePropTypes.map.isRequired,
    deletePushNotification: PropTypes.func.isRequired,
    error: PropTypes.any,
    loadPushNotification: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    routerPushWithReturnTo: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.redirect = ::this.redirect;
    this.onChangeTab = :: this.onChangeTab;
  }

  async componentWillMount () {
    if (this.props.params.pushNotificationId) {
      await this.props.loadPushNotification(this.props.params.pushNotificationId);
    }
  }

  redirect () {
    this.props.routerPushWithReturnTo('/content/push-notifications', true);
  }

  onChangeTab (index) {
    this.props.routerPushWithReturnTo({ ...this.props.location, query: { ...this.props.location.query, tabIndex: index } });
  }

  static styles= {
    table: {
      backgroundColor: colors.lightGray4,
      paddingTop: '20px'
    },
    background: {
      width: '86px',
      height: '17px',
      borderRadius: '2px',
      backgroundColor: '#f6faf0',
      marginLeft: '7px',
      verticalAlign: 'top',
      transition: 'background-color 200ms linear, border-color 200ms linear',
      border: '1px solid rgb(220, 233, 196)'
    },
    status: {
      fontFamily: 'Rubik',
      fontSize: '10px',
      letterSpacing: '0.8px',
      color: '#98b760',
      margin: 'auto',
      textAlign: 'center'
    },
    oval: {
      width: '17px',
      height: '17px',
      float: 'left',
      marginTop: '-4px',
      color: '#98b760'
    }
  }

  render () {
    const { styles } = this.constructor;
    const { params, children, currentPushNotification, location, location: { query: { tabIndex } }, deletePushNotification } = this.props;
    const defaultLocale = currentPushNotification.get('defaultLocale');
    const blocks = [
      { content: '-', title: 'Approximate Reach', color: '#536970' },
      { content: '-', title: 'Delivered', color: '#aacc6b' },
      { content: '-', title: 'Failed', color: '#da5454' },
      { content: '-', title: 'Interaction rate', color: '#536970' }
    ];
    return (
      <SideMenu>
        <Root>
          <Header hierarchy={[
            { title: 'Push Notification', url: '/content/push-notifications' },
            { title: currentPushNotification.getIn([ 'payloadData', defaultLocale ]), url: location } ]}/>
          <Container>
            {currentPushNotification.get('_status') === 'loaded' && currentPushNotification &&
              <EntityDetails
                content={`Sent on ${moment(currentPushNotification.getIn([ 'pushWindowStart' ])).toString()}`}
                imageUrl={currentPushNotification.getIn([ 'profileImage', defaultLocale, 'url' ]) && `${currentPushNotification.getIn([ 'profileImage', defaultLocale, 'url' ])}?height=203&width=360`}
                subtitle={currentPushNotification.getIn([ 'payloadData', defaultLocale ])}
                title='Push Notification'
                titleBadge={<button style={[ styles.background ]} ><div style={[ styles.oval ]}>●</div><div style={[ styles.status ]}>{currentPushNotification.get('publishStatus')}</div></button>}
                onEdit={() => { this.props.routerPushWithReturnTo(`/content/push-notifications/edit/${params.pushNotificationId}`); }}
                onRemove={async () => { await deletePushNotification(currentPushNotification.getIn([ 'id' ])); this.redirect(); }}/>}
          </Container>
          <Line/>
          <Statistics blocks={blocks}/>
          <Line/>
          <div style={[ generalStyles.fillPage, styles.table ]}>
            <Container>
              <Tabs activeTab={tabIndex} onChange={this.onChangeTab}>
                <Tab title='Push Notification'>
                  <Section/>
                </Tab>
              </Tabs>
            </Container>
          </div>
          <Line/>
          {children}
        </Root>
      </SideMenu>
    );
  }

}
