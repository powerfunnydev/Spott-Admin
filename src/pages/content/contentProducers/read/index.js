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
import * as listActions from '../list/actions';
import { routerPushWithReturnTo } from '../../../../actions/global';
import BreadCrumbs from '../../../_common/breadCrumbs';
import Line from '../../../_common/components/line';
import UserList from './users/list';
import { Tabs, Tab } from '../../../_common/components/formTabs';
import { generalStyles } from '../../../_common/components/table/index';

@connect(selector, (dispatch) => ({
  deleteContentProducer: bindActionCreators(listActions.deleteContentProducer, dispatch),
  loadContentProducer: bindActionCreators(actions.loadContentProducer, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch)
}))
@Radium
export default class ReadContentProducer extends Component {

  static propTypes = {
    children: PropTypes.node,
    currentContentProducer: PropTypes.object.isRequired,
    deleteContentProducer: PropTypes.func.isRequired,
    error: PropTypes.any,
    loadContentProducer: PropTypes.func.isRequired,
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
    if (this.props.params.id) {
      await this.props.loadContentProducer(this.props.params.id);
    }
  }

  getName (contentProducer) {
    return contentProducer.get('name');
  }

  redirect () {
    this.props.routerPushWithReturnTo('content/contentProducers', true);
  }

  onChangeTab (index) {
    this.props.routerPushWithReturnTo({ ...this.props.location, query: { ...this.props.location.query, tabIndex: index } });
  }

  static styles= {
    table: {
      backgroundColor: colors.lightGray4,
      paddingTop: '20px'
    }
  };

  render () {
    const { children, currentContentProducer,
       location, deleteContentProducer, location: { query: { tabIndex } } } = this.props;
    const { styles } = this.constructor;
    return (
      <Root>
        <Header currentLocation={location} hideHomePageLinks />
        <SpecificHeader/>
        <BreadCrumbs hierarchy={[ { title: 'List', url: '/content/content-producers' }, { title: currentContentProducer.get('name'), url: location.pathname } ]}/>
        <Container>
          {currentContentProducer.get('_status') === 'loaded' && currentContentProducer &&
            <EntityDetails
              imageUrl={currentContentProducer.get('logo') && `${currentContentProducer.getIn([ 'logo', 'url' ])}?height=310&width=310`}
              title={currentContentProducer.getIn([ 'name' ])}
              onEdit={() => this.props.routerPushWithReturnTo(`content/content-producers/edit/${currentContentProducer.getIn([ 'id' ])}`)}
              onRemove={async () => {
                await deleteContentProducer(currentContentProducer.getIn([ 'id' ]));
                this.redirect();
              }}/>}
        </Container>
        <Line/>
        <div style={[ generalStyles.fillPage, styles.table ]}>
          <Container>
            <Tabs activeTab={tabIndex} onChange={this.onChangeTab}>
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
