import React, { Component, PropTypes } from 'react';
import { push as routerPush } from 'react-router-redux';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Header from '../../../app/header';
import { colors, Container } from '../../../_common/styles';
import localized from '../../../_common/localized';
import * as actions from './actions';
import SpecificHeader from '../../header';
import selector from './selector';
import EntityDetails from '../../../_common/entityDetails';
import * as listActions from '../list/actions';

@localized
@connect(selector, (dispatch) => ({
  deleteBroadcastersEntry: bindActionCreators(listActions.deleteBroadcastersEntry, dispatch),
  load: bindActionCreators(actions.load, dispatch),
  routerPush: bindActionCreators(routerPush, dispatch)
}))
@Radium
export default class ReadBroadcastersEntry extends Component {

  static propTypes = {
    children: PropTypes.node,
    currentBroadcaster: PropTypes.object.isRequired,
    deleteBroadcastersEntry: PropTypes.func.isRequired,
    error: PropTypes.any,
    load: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    routerPush: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.redirect = ::this.redirect;
  }

  async componentDidMount () {
    if (this.props.params.id) {
      console.log('id', this.props.params.id);
      await this.props.load(this.props.params.id);
    }
  }

  redirect () {
    this.props.routerPush((this.props.location && this.props.location.state && this.props.location.state.returnTo) || 'content/broadcasters');
  }

  render () {
    const { children, currentBroadcaster, location: { pathname }, deleteBroadcastersEntry } = this.props;
    return (
      <div style={{ backgroundColor: colors.lightGray4, paddingBottom: '50px' }}>
        <Header currentPath={pathname} hideHomePageLinks />
        <SpecificHeader/>
        <Container>
          {currentBroadcaster.get('_status') === 'loaded' && currentBroadcaster &&
            <EntityDetails image={currentBroadcaster.getIn([ 'logo', 'url' ])} title={currentBroadcaster.getIn([ 'name' ])}
              onEdit={() => { this.props.routerPush(`content/broadcasters/edit/${currentBroadcaster.getIn([ 'id' ])}`); }}
              onRemove={() => { deleteBroadcastersEntry(currentBroadcaster.getIn([ 'id' ])); this.redirect(); }}/>}
        </Container>
        <button onClick={() => { this.props.routerPush(`content/broadcasters/read/${currentBroadcaster.getIn([ 'id' ])}/create/broadcast-channel`); }}>Add channel </button>
        {children}
      </div>
    );
  }

}
