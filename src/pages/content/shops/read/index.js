import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Root, Container } from '../../../_common/styles';
import * as actions from './actions';
import selector from './selector';
import EntityDetails from '../../../_common/entityDetails';
import * as listActions from '../list/actions';
import { routerPushWithReturnTo } from '../../../../actions/global';
import Line from '../../../_common/components/line';
import BreadCrumbs from '../../../_common/components/breadCrumbs';
import { SideMenu } from '../../../app/sideMenu';

/* eslint-disable no-alert */

@connect(selector, (dispatch) => ({
  deleteShop: bindActionCreators(listActions.deleteShop, dispatch),
  loadShop: bindActionCreators(actions.loadShop, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch)
}))
@Radium
export default class ReadShop extends Component {

  static propTypes = {
    children: PropTypes.node,
    currentShop: PropTypes.object.isRequired,
    deleteShop: PropTypes.func.isRequired,
    error: PropTypes.any,
    loadShop: PropTypes.func.isRequired,
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
    if (this.props.params.shopId) {
      await this.props.loadShop(this.props.params.shopId);
    }
  }

  redirect () {
    this.props.routerPushWithReturnTo('content/characters', true);
  }

  onChangeTab (index) {
    this.props.routerPushWithReturnTo({ ...this.props.location, query: { ...this.props.location.query, tabIndex: index } });
  }

  static styles= {

  }

  render () {
    const { params, children, currentShop, location, deleteShop } = this.props;
    const defaultLocale = currentShop.get('defaultLocale');
    return (
      <SideMenu>
        <Root>
          <BreadCrumbs hierarchy={[
            { title: 'Shops', url: '/content/shops' },
            { title: currentShop.getIn([ 'name', defaultLocale ]), url: location } ]}/>
          <Container>
            {currentShop.get('_status') === 'loaded' && currentShop &&
              <EntityDetails
                imageUrl={currentShop.getIn([ 'logo', defaultLocale, 'url' ]) && `${currentShop.getIn([ 'logo', defaultLocale, 'url' ])}?height=203&width=360`}
                title={currentShop.getIn([ 'name', defaultLocale ])}
                onEdit={() => { this.props.routerPushWithReturnTo(`content/shops/edit/${params.shopId}`); }}
                onRemove={async () => { await deleteShop(currentShop.get('id')); this.redirect(); }}/>}
          </Container>
          <Line/>
          {children}
        </Root>
      </SideMenu>
    );
  }

}
