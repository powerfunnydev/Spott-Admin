import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { bindActionCreators } from 'redux';
import Header from '../../../app/header';
import { colors, Container } from '../../../_common/styles';
import localized from '../../../_common/localized';
import * as actions from './actions';
import SpecificHeader from '../../header';
import selector from './selector';
import EntityDetails from '../../../_common/entityDetails';
import * as listActions from '../list/actions';
import Dropdown, { styles as dropdownStyles } from '../../../_common/components/dropdown';
import { routerPushWithReturnTo } from '../../../../actions/global';
import BreadCrumbs from '../../../_common/breadCrumbs';

const plusIcon = require('../../../../assets/images/plus-gray.svg');

@Radium
class BroadcastChannelImage extends Component {
  static propTypes={
    imageUrl: PropTypes.string,
    text: PropTypes.string,
    onCreate: PropTypes.func,
    onEdit: PropTypes.func
  }

  static styles = {
    imageContainer: {
      position: 'relative',
      height: '103px',
      borderRadius: '2px',
      // backgroundColor: colors.lightGray5,
      border: `solid 1px ${colors.veryLightGray}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    image: {
      width: '184px',
      height: '103px'
    },
    dropdown: {
      position: 'absolute',
      top: '7px',
      right: '7px'
    },
    broadcastChannel: {
      display: 'flex',
      justifyContent: 'center',
      paddingTop: '10px'
    },
    darkGray: {
      border: `solid 1px ${colors.lightGray2}`
    },
    clickable: {
      cursor: 'pointer'
    }
  }
  render () {
    const { imageUrl, text, onCreate, onEdit } = this.props;
    const { styles } = this.constructor;
    return (
      <div style={{ display: 'inline-block', paddingRight: '24px' }}>
        {onEdit &&
          <div>
            <div style={[ styles.imageContainer, styles.image ]}>
              {imageUrl && <img src={imageUrl} style={styles.image}/>}
              {!imageUrl && <div>No image</div>}
                <Dropdown style={styles.dropdown}>
                  <div key={1} style={[ dropdownStyles.option ]} onClick={onEdit}>Edit</div>
                </Dropdown>
            </div>
            <div style={styles.broadcastChannel}>{text}</div>
          </div>
        }
        {onCreate &&
          <div style={[ styles.imageContainer, styles.image, styles.darkGray, styles.clickable ]} onClick={onCreate}>
            <img src={plusIcon}/>
          </div>
        }
      </div>
    );
  }
}
@localized
@connect(selector, (dispatch) => ({
  deleteBroadcastersEntry: bindActionCreators(listActions.deleteBroadcastersEntry, dispatch),
  load: bindActionCreators(actions.load, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch)
}))
@Radium
export default class ReadBroadcastersEntry extends Component {

  static propTypes = {
    broadcastChannels: ImmutablePropTypes.map.isRequired,
    children: PropTypes.node,
    currentBroadcaster: PropTypes.object.isRequired,
    deleteBroadcastersEntry: PropTypes.func.isRequired,
    error: PropTypes.any,
    load: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    routerPushWithReturnTo: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.redirect = ::this.redirect;
  }

  async componentWillMount () {
    if (this.props.params.id) {
      await this.props.load(this.props.params.id);
    }
  }

  redirect () {
    this.props.routerPushWithReturnTo('content/broadcasters', true);
  }

  static styles= {
    row: {
      display: 'flex',
      flexDirection: 'row'
    }
  }
  render () {
    const { children, currentBroadcaster, location, deleteBroadcastersEntry } = this.props;
    const { styles } = this.constructor;
    return (
      <div>
        <Header currentLocation={location} hideHomePageLinks />
        <SpecificHeader/>
        <BreadCrumbs hierarchy={[ { title: 'List', url: '/content/broadcasters' }, { title: currentBroadcaster.get('name'), url: location.pathname } ]}/>
        <Container>
          {currentBroadcaster.get('_status') === 'loaded' && currentBroadcaster &&
            <EntityDetails image={currentBroadcaster.getIn([ 'logo', 'url' ])} title={currentBroadcaster.getIn([ 'name' ])}
              onEdit={() => { this.props.routerPushWithReturnTo(`content/broadcasters/edit/${currentBroadcaster.getIn([ 'id' ])}`); }}
              onRemove={() => { deleteBroadcastersEntry(currentBroadcaster.getIn([ 'id' ])); this.redirect(); }}/>}
        </Container>
        <Container>
          <div style={styles.row}>
            { this.props.broadcastChannels.get('data').map((broadcastChannel, index) => (
              <BroadcastChannelImage imageUrl={broadcastChannel.getIn([ 'logo', 'url' ])} key={`broadcastChannel${index}`} text={broadcastChannel.get('name')} onEdit={(e) => { e.preventDefault(); this.props.routerPushWithReturnTo(`content/broadcast-channels/edit/${broadcastChannel.get('id')}`); }}/>
            ))}
            <BroadcastChannelImage key={'createBroadcastChannel'} onCreate={() => { this.props.routerPushWithReturnTo(`content/broadcasters/read/${currentBroadcaster.getIn([ 'id' ])}/create/broadcast-channel`); }}/>
          </div>
        </Container>
        {children}
      </div>
    );
  }

}
