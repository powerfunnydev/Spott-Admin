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
import { SideMenu } from '../../../app/sideMenu';
import Header from '../../../app/multiFunctionalHeader';
import { generalStyles } from '../../../_common/components/table/index';
import { Tabs, Tab } from '../../../_common/components/formTabs';

/* eslint-disable no-alert */

@connect(selector, (dispatch) => ({
  deleteSpott: bindActionCreators(listActions.deleteSpott, dispatch),
  loadSpott: bindActionCreators(actions.loadSpott, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch)
}))
@Radium
export default class ReadSpott extends Component {

  static propTypes = {
    children: PropTypes.node,
    currentSpott: PropTypes.object.isRequired,
    deleteSpott: PropTypes.func.isRequired,
    error: PropTypes.any,
    loadSpott: PropTypes.func.isRequired,
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
    if (this.props.params.brandId) {
      await this.props.loadSpott(this.props.params.brandId);
    }
  }

  redirect () {
    this.props.routerPushWithReturnTo('/content/characters', true);
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
    const { params, children, currentSpott, location, deleteSpott, location: { query: { tabIndex } } } = this.props;
    const { styles } = this.constructor;
    const defaultLocale = currentSpott.get('defaultLocale');
    return (
      <SideMenu>
        <Root>
          <Header hierarchy={[
            { title: 'Spotts', url: '/content/spotts' },
            { title: currentSpott.getIn([ 'title', defaultLocale ]), url: location } ]}/>
          <Container>
            {currentSpott.get('_status') === 'loaded' && currentSpott &&
              <EntityDetails
                imageUrl={currentSpott.getIn([ 'image', 'url' ]) && `${currentSpott.getIn([ 'image', 'url' ])}?height=203&width=360`}
                title={currentSpott.getIn([ 'title', defaultLocale ])}
                onEdit={() => { this.props.routerPushWithReturnTo(`/content/spotts/edit/${params.spottId}`); }}
                onRemove={async () => { await deleteSpott(currentSpott.get('id')); this.redirect(); }}/>}
          </Container>
          <Line/>
          {/* <div style={[ generalStyles.fillPage, styles.table ]}>
            <Container>
              <Tabs activeTab={tabIndex} onChange={this.onChangeTab}>
                <Tab title='Products'>
                  Products
                </Tab>
              </Tabs>
            </Container>
          </div> */}
          {children}
        </Root>
      </SideMenu>
    );
  }

}
