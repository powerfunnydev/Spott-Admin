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
  deleteCharacter: bindActionCreators(listActions.deleteCharacter, dispatch),
  loadCharacter: bindActionCreators(actions.loadCharacter, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch)
}))
@Radium
export default class ReadCharacter extends Component {

  static propTypes = {
    children: PropTypes.node,
    currentCharacter: PropTypes.object.isRequired,
    deleteCharacter: PropTypes.func.isRequired,
    error: PropTypes.any,
    loadCharacter: PropTypes.func.isRequired,
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
    if (this.props.params.characterId) {
      await this.props.loadCharacter(this.props.params.characterId);
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
    const { params, children, currentCharacter, location, deleteCharacter } = this.props;
    const defaultLocale = currentCharacter.getIn([ 'defaultLocale' ]);
    return (
      <SideMenu location={location}>
        <Root>
          <BreadCrumbs hierarchy={[
            { title: 'Characters', url: '/content/characters' },
            { title: currentCharacter.getIn([ 'name', defaultLocale ]), url: location } ]}/>
          <Container>
            {currentCharacter.get('_status') === 'loaded' && currentCharacter &&
              <EntityDetails
                imageUrl={currentCharacter.getIn([ 'profileImage', 'url' ]) && `${currentCharacter.getIn([ 'profileImage', 'url' ])}?height=203&width=360`}
                title={currentCharacter.getIn([ 'name', defaultLocale ])}
                onEdit={() => { this.props.routerPushWithReturnTo(`content/characters/edit/${params.characterId}`); }}
                onRemove={async () => { await deleteCharacter(currentCharacter.getIn([ 'id' ])); this.redirect(); }}/>}
          </Container>
          <Line/>
          {children}
        </Root>
      </SideMenu>
    );
  }

}
