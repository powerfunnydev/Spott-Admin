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

@connect(selector, (dispatch) => ({
  deleteCommercial: bindActionCreators(listActions.deleteCommercial, dispatch),
  loadCommercial: bindActionCreators(actions.loadCommercial, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch)
}))
@Radium
export default class ReadCommercial extends Component {

  static propTypes = {
    children: PropTypes.node,
    currentCommercial: PropTypes.object.isRequired,
    deleteCommercial: PropTypes.func.isRequired,
    error: PropTypes.any,
    loadCommercial: PropTypes.func.isRequired,
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

  componentWillMount () {
    if (this.props.params.commercialId) {
      this.props.loadCommercial(this.props.params.commercialId);
    }
  }

  redirect () {
    this.props.routerPushWithReturnTo('/content/commercials', true);
  }

  onChangeTab (index) {
    this.props.routerPushWithReturnTo({ ...this.props.location, query: { ...this.props.location.query, tabIndex: index } });
  }

  onClickNewEntry (e) {
    e.preventDefault();
    this.props.routerPushWithReturnTo('/content/commercials');
  }

  static styles= {
    table: {
      backgroundColor: colors.lightGray4,
      paddingTop: '20px'
    }
  }

  render () {
    const { params, children, currentCommercial, deleteCommercial } = this.props;
    const defaultLocale = currentCommercial.get('defaultLocale');

    return (
      <SideMenu>
        <Root>
          <Header hierarchy={[
            { title: 'Commercials', url: '/content/commercials' },
            { title: currentCommercial.getIn([ 'title', defaultLocale ]), url: `/content/commercials/read/${params.commercialId}` }
          ]}/>
          <Container>
            {currentCommercial.get('_status') === 'loaded' && currentCommercial &&
              <EntityDetails
                imageUrl={currentCommercial.getIn([ 'profileImage', defaultLocale ]) && `${currentCommercial.getIn([ 'profileImage', defaultLocale, 'url' ])}?height=203&width=360`}
                title={currentCommercial.getIn([ 'title', defaultLocale ])}
                onEdit={() => this.props.routerPushWithReturnTo(`/content/commercials/edit/${params.commercialId}`)}
                onRemove={async () => { await deleteCommercial(params.commercialId); this.redirect(); }}/>}
          </Container>
          <Line/>
          {children}
        </Root>
      </SideMenu>
    );
  }

}
