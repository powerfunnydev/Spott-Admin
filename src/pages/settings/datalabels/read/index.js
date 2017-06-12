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
  deleteDatalabel: bindActionCreators(listActions.deleteDatalabel, dispatch),
  loadDatalabel: bindActionCreators(actions.loadDatalabel, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch)
}))
@Radium
export default class ReadDatalabel extends Component {

  static propTypes = {
    children: PropTypes.node,
    currentDatalabel: PropTypes.object.isRequired,
    deleteDatalabel: PropTypes.func.isRequired,
    error: PropTypes.any,
    loadDatalabel: PropTypes.func.isRequired,
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
    if (this.props.params.datalabelId) {
      await this.props.loadDatalabel(this.props.params.datalabelId);
    }
  }

  getName (datalabel) {
    return datalabel.get('name');
  }

  redirect () {
    this.props.routerPushWithReturnTo('/settings/datalabeles', true);
  }

  onChangeTab (tab) {
    this.props.routerPushWithReturnTo({ ...this.props.location, query: { ...this.props.location.query, tab } });
  }

  onClickNewEntry (e) {
    e.preventDefault();
    const datalabelId = this.props.params.datalabelId;
    if (datalabelId) {
      this.props.routerPushWithReturnTo(`/settings/datalabels/read/${datalabelId}`);
    }
  }

  static styles= {
    table: {
      backgroundColor: colors.lightGray4,
      paddingTop: '20px'
    }
  };

  render () {
    const {
      children, currentDatalabel, deleteDatalabel, location } = this.props;

    return (
      <SideMenu>
        <Root>
          <Header
            hierarchy={[
              { title: 'Labels', url: '/settings/datalabels' },
              { title: currentDatalabel.get('name'), url: location.pathname }
            ]}/>
          <Container>
            {currentDatalabel.get('_status') === 'loaded' && currentDatalabel &&
              <EntityDetails
                title={currentDatalabel.getIn([ 'name' ])}
                onEdit={() => this.props.routerPushWithReturnTo(`/settings/datalabels/edit/${currentDatalabel.getIn([ 'id' ])}`)}
                onRemove={async () => {
                  await deleteDatalabel(currentDatalabel.getIn([ 'id' ]));
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
