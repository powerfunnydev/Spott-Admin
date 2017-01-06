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
import ProductList from './products/list';
import { generalStyles } from '../../../_common/components/table/index';
import { Tabs, Tab } from '../../../_common/components/formTabs';

/* eslint-disable no-alert */

@connect(selector, (dispatch) => ({
  deleteBrand: bindActionCreators(listActions.deleteBrand, dispatch),
  loadBrand: bindActionCreators(actions.loadBrand, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch)
}))
@Radium
export default class ReadBrand extends Component {

  static propTypes = {
    children: PropTypes.node,
    currentBrand: PropTypes.object.isRequired,
    deleteBrand: PropTypes.func.isRequired,
    error: PropTypes.any,
    loadBrand: PropTypes.func.isRequired,
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
      await this.props.loadBrand(this.props.params.brandId);
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
    const { params, children, currentBrand, location, deleteBrand, location: { query: { tabIndex } } } = this.props;
    const { styles } = this.constructor;
    const defaultLocale = currentBrand.get('defaultLocale');
    return (
      <SideMenu>
        <Root>
          <Header hierarchy={[
            { title: 'Brands', url: '/content/brands' },
            { title: currentBrand.getIn([ 'name', defaultLocale ]), url: location } ]}/>
          <Container>
            {currentBrand.get('_status') === 'loaded' && currentBrand &&
              <EntityDetails
                imageUrl={currentBrand.getIn([ 'logo', defaultLocale, 'url' ]) && `${currentBrand.getIn([ 'logo', defaultLocale, 'url' ])}?height=203&width=360`}
                title={currentBrand.getIn([ 'name', defaultLocale ])}
                onEdit={() => { this.props.routerPushWithReturnTo(`/content/brands/edit/${params.brandId}`); }}
                onRemove={async () => { await deleteBrand(currentBrand.get('id')); this.redirect(); }}/>}
          </Container>
          <Line/>
          <div style={[ generalStyles.fillPage, styles.table ]}>
            <Container>
              <Tabs activeTab={tabIndex} onChange={this.onChangeTab}>
                <Tab title='Products'>
                  <ProductList {...this.props}/>
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
