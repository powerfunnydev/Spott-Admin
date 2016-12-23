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
  deletePerson: bindActionCreators(listActions.deletePerson, dispatch),
  loadPerson: bindActionCreators(actions.loadPerson, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch)
}))
@Radium
export default class ReadPerson extends Component {

  static propTypes = {
    children: PropTypes.node,
    currentPerson: PropTypes.object.isRequired,
    deletePerson: PropTypes.func.isRequired,
    error: PropTypes.any,
    loadPerson: PropTypes.func.isRequired,
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
    if (this.props.params.personId) {
      await this.props.loadPerson(this.props.params.personId);
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
    const { params, children, currentPerson, location, deletePerson } = this.props;
    return (
      <SideMenu>
        <Root>
          <BreadCrumbs hierarchy={[
            { title: 'People', url: '/content/persons' },
            { title: currentPerson.get('fullName'), url: location } ]}/>
          <Container>
            {currentPerson.get('_status') === 'loaded' && currentPerson &&
              <EntityDetails
                imageUrl={currentPerson.getIn([ 'profileImage', 'url' ]) && `${currentPerson.getIn([ 'profileImage', 'url' ])}?height=203&width=360`}
                title={currentPerson.get('fullName')}
                onEdit={() => { this.props.routerPushWithReturnTo(`/content/persons/edit/${params.personId}`); }}
                onRemove={async () => { await deletePerson(currentPerson.get('id')); this.redirect(); }}/>}
          </Container>
          <Line/>
          {children}
        </Root>
      </SideMenu>
    );
  }

}
