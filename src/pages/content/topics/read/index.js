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
import { Tabs, Tab } from '../../../_common/components/formTabs';
import Line from '../../../_common/components/line';
import { SideMenu } from '../../../app/sideMenu';
import Header from '../../../app/multiFunctionalHeader';
import { generalStyles } from '../../../_common/components/table/index';
import TopicList from '../../_topicSpotts';

/* eslint-disable no-alert */

@connect(selector, (dispatch) => ({
  deleteTopic: bindActionCreators(listActions.deleteTopic, dispatch),
  loadTopic: bindActionCreators(actions.loadTopic, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch)
}))
@Radium
export default class ReadTopic extends Component {

  static propTypes = {
    children: PropTypes.node,
    currentTopic: PropTypes.object.isRequired,
    deleteTopic: PropTypes.func.isRequired,
    error: PropTypes.any,
    loadTopic: PropTypes.func.isRequired,
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
    if (this.props.params.topicId) {
      await this.props.loadTopic(this.props.params.topicId);
    }
  }

  redirect () {
    this.props.routerPushWithReturnTo('/content/topics', true);
  }

  onChangeTab (index) {
    this.props.routerPushWithReturnTo({ ...this.props.location, query: { ...this.props.location.query, tabIndex: index } });
  }

  static styles= {
    table: {
      backgroundColor: colors.lightGray4,
      paddingTop: '20px'
    }
  }

  render () {
    const { params, children, currentTopic, location, deleteTopic, location: { query: { tabIndex } } } = this.props;
    const { styles } = this.constructor;
    return (
      <SideMenu>
        <Root>
          <Header hierarchy={[
            { title: 'Topics', url: '/content/topics' },
            { title: currentTopic.getIn([ 'text' ]), url: location } ]}/>
          <Container>
            {currentTopic.get('_status') === 'loaded' && currentTopic &&
              <EntityDetails
                imageUrl={currentTopic.getIn([ 'profileImage', 'url' ]) && `${currentTopic.getIn([ 'profileImage', 'url' ])}?height=203&width=360`}
                title={currentTopic.getIn([ 'text' ])}
                onEdit={() => { this.props.routerPushWithReturnTo(`/content/topics/edit/${params.topicId}`); }}
                onRemove={currentTopic.get('readOnly') ? null : async () => { await deleteTopic(currentTopic.get('id')); this.redirect(); }}/>}
          </Container>
          <Line/>
          <div style={[ generalStyles.fillPage, styles.table ]}>
            <Container>
              <Tabs activeTab={tabIndex} onChange={this.onChangeTab}>
                <Tab title='Spotts'>
                  <TopicList {...this.props} topicId={params.topicId}/>
                </Tab>
              </Tabs>
            </Container>
          </div>
          {children}
        </Root>
      </SideMenu>
    );
  }

}
