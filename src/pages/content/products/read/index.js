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
import { SideMenu } from '../../../app/sideMenu';
import Header from '../../../app/multiFunctionalHeader';

/* eslint-disable no-alert */

@connect(selector, (dispatch) => ({
  deleteProduct: bindActionCreators(listActions.deleteProduct, dispatch),
  loadProduct: bindActionCreators(actions.loadProduct, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch)
}))
@Radium
export default class ReadProduct extends Component {

  static propTypes = {
    children: PropTypes.node,
    currentProduct: PropTypes.object.isRequired,
    deleteProduct: PropTypes.func.isRequired,
    error: PropTypes.any,
    loadProduct: PropTypes.func.isRequired,
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
    if (this.props.params.productId) {
      await this.props.loadProduct(this.props.params.productId);
    }
  }

  getTitle (season) {
    return season.get('name');
  }

  redirect () {
    this.props.routerPushWithReturnTo('/content/products', true);
  }

  onChangeTab (index) {
    this.props.routerPushWithReturnTo({ ...this.props.location, query: { ...this.props.location.query, tabIndex: index } });
  }

  onClickNewEntry (e) {
    e.preventDefault();
    const seasonId = this.props.params.seasonId;
    if (seasonId) {
      this.props.routerPushWithReturnTo('/content/products/create');
    }
  }

  static styles= {

  }

  render () {
    const { params, children, currentProduct, location, deleteProduct } = this.props;
    const defaultLocale = currentProduct.getIn([ 'defaultLocale' ]);
    return (
      <SideMenu>
        <Root>
          <Header hierarchy={[
            { title: 'Products', url: '/content/products' },
            { title: currentProduct.getIn([ 'shortName', defaultLocale ]), url: location } ]}/>
          <Container>
            {currentProduct.get('_status') === 'loaded' && currentProduct &&
              <EntityDetails
                imageUrl={currentProduct.getIn([ 'logo', defaultLocale, 'url' ]) && `${currentProduct.getIn([ 'logo', defaultLocale, 'url' ])}?height=203&width=360`}
                title={currentProduct.getIn([ 'shortName', defaultLocale ])}
                onEdit={() => { this.props.routerPushWithReturnTo(`/content/products/edit/${params.productId}`); }}
                onRemove={async () => { await deleteProduct(currentProduct.getIn([ 'id' ])); this.redirect(); }}/>}
          </Container>
          <Line/>
          {children}
        </Root>
      </SideMenu>
    );
  }
}
