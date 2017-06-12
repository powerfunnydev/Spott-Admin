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
  deleteDatalabeltype: bindActionCreators(listActions.deleteDatalabeltype, dispatch),
  loadDatalabeltype: bindActionCreators(actions.loadDatalabeltype, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch)
}))
@Radium
export default class ReadDatalabeltype extends Component {

  static propTypes = {
    children: PropTypes.node,
    currentDatalabeltype: PropTypes.object.isRequired,
    deleteDatalabeltype: PropTypes.func.isRequired,
    error: PropTypes.any,
    loadDatalabeltype: PropTypes.func.isRequired,
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
    if (this.props.params.datalabeltypeId) {
      await this.props.loadDatalabeltype(this.props.params.datalabeltypeId);
    }
  }

  getName (datalabeltype) {
    return datalabeltype.get('name');
  }

  redirect () {
    this.props.routerPushWithReturnTo('/settings/datalabeltypes', true);
  }

  onChangeTab (tab) {
    this.props.routerPushWithReturnTo({ ...this.props.location, query: { ...this.props.location.query, tab } });
  }

  onClickNewEntry (e) {
    e.preventDefault();
    const datalabeltypeId = this.props.params.datalabeltypeId;
    if (datalabeltypeId) {
      this.props.routerPushWithReturnTo(`/settings/datalabeltypes/read/${datalabeltypeId}`);
    }
  }

  static styles= {
    table: {
      backgroundColor: colors.lightGray4,
      paddingTop: '20px'
    },
    background: {
      backgroundColor: colors.lightGray4,
      paddingBottom: '50px'
    },
    paddingTop: {
      paddingTop: '1.25em'
    }
  };

  render () {
    const {
      children, currentDatalabeltype, deleteDatalabeltype, location } = this.props;

    return (
      <SideMenu>
        <Root>
          <Header
            hierarchy={[
              { title: 'Label Types', url: '/settings/datalabeltypes' },
              { title: currentDatalabeltype.getIn([ 'name', currentDatalabeltype.get('defaultLocale') ]), url: location.pathname }
            ]}/>
          <Container>
            {currentDatalabeltype.get('_status') === 'loaded' && currentDatalabeltype && currentDatalabeltype.getIn([ 'name', currentDatalabeltype.get('defaultLocale') ]) &&
              <EntityDetails
                title={currentDatalabeltype.getIn([ 'name', currentDatalabeltype.get('defaultLocale') ])}
                onEdit={() => this.props.routerPushWithReturnTo(`/settings/datalabeltypes/edit/${currentDatalabeltype.getIn([ 'id' ])}`)}
                onRemove={async () => {
                  await deleteDatalabeltype(currentDatalabeltype.getIn([ 'id' ]));
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
