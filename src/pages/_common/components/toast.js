import Radium from 'radium';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import * as toastActions from '../../../actions/toast';
import toastSelector from '../../../selectors/toast';
import { colors, makeTextStyle, fontWeights } from '../styles';
import CompletedSVG from '../images/completed';
import PlusSVG from '../images/plus';
import { routerPushWithReturnTo } from '../../../actions/global';

@connect(null, (dispatch) => ({
  popToast: bindActionCreators(toastActions.pop, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch)
}))
@Radium
export class SuccessMessage extends Component {

  static propTypes = {
    entity: PropTypes.object.isRequired,
    entityType: PropTypes.string.isRequired,
    popToast: PropTypes.func.isRequired,
    routerPushWithReturnTo: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.broadcastChannelPersistSuccess = ::this.broadcastChannelPersistSuccess;
    this.broadcasterPersistSuccess = ::this.broadcasterPersistSuccess;
    this.contentProducerPersistSuccess = ::this.contentProducerPersistSuccess;
    this.userPersistSuccess = ::this.userPersistSuccess;
  }

  async redirect (url) {
    await this.props.routerPushWithReturnTo(url);
    await this.props.popToast();
  }

  broadcastChannelPersistSuccess (broadcastChannel) {
    const { styles } = this.constructor;
    return (
      <span>
        Broadcast channel <span style={styles.clickable} onClick={this.redirect.bind(this, `/content/broadcast-channels/edit/${broadcastChannel.id}`)}>
          {broadcastChannel.name}
        </span> has been succesfully persisted.
      </span>
    );
  }

  broadcasterPersistSuccess (broadcaster) {
    const { styles } = this.constructor;
    return (
      <span>
        Broadcaster <span style={styles.clickable} onClick={this.redirect.bind(this, `/content/broadcasters/edit/${broadcaster.id}`)}>
          {broadcaster.name}
        </span> has been succesfully persisted.
      </span>
    );
  }

  contentProducerPersistSuccess (contentProducer) {
    const { styles } = this.constructor;
    return (
      <span>
        Content producer <span style={styles.clickable} onClick={this.redirect.bind(this, `/content/content-producers/edit/${contentProducer.id}`)}>
          {contentProducer.name}
        </span> has been succesfully persisted.
      </span>
    );
  }

  userPersistSuccess (user) {
    const { styles } = this.constructor;
    return (
      <span>
        User <span style={styles.clickable} onClick={this.redirect.bind(this, `/users/edit/${user.id}`)}>
          {user.firstName} {user.firstName}
        </span> has been succesfully persisted.
      </span>
    );
  }

  static styles = {
    clickable: {
      cursor: 'pointer',
      fontSize: '12px',
      color: colors.veryDarkGray,
      ':hover': {
        textDecoration: 'underline'
      }
    }
  };

  render () {
    const { entityType, entity } = this.props;
    if (entityType === 'broadcastChannel') {
      return this.broadcastChannelPersistSuccess(entity);
    } else if (entityType === 'broadcaster') {
      return this.broadcasterPersistSuccess(entity);
    } else if (entityType === 'contentProducer') {
      return this.contentProducerPersistSuccess(entity);
    } else if (entityType === 'user') {
      return this.userPersistSuccess(entity);
    }
    return <span>Toast message of this entity isn't supported yet.</span>;
  }
}

@connect(toastSelector, (dispatch) => ({
  popToast: bindActionCreators(toastActions.pop, dispatch)
}))
@Radium
export default class Toast extends Component {

  static propTypes = {
    currentToast: ImmutablePropTypes.map,
    popToast: PropTypes.func.isRequired
  };

  componentDidUpdate () {
    // We received a new toast, let's timeout
    if (this.props.currentToast) {
      setTimeout(() => {
        this.props.popToast();
      }, 3000);
    }
  }

  static styles = {
    container: {
      display: 'flex',
      flexDirection: 'row',
      width: 380,
      position: 'fixed',
      right: 40,
      top: 40,
      minHeight: 60, // Matches the flex-basis in icon.base style
      zIndex: 2,
      boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.25)'
    },
    icon: {
      base: {
        minWidth: '56px',
        minHeight: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderTopLeftRadius: '2px',
        borderBottomLeftRadius: '2px'
      },
      error: {
        backgroundColor: 'rgb(236, 65, 15)',
        border: '1px solid rgb(236, 65, 15)'
      },
      info: {
        backgroundColor: 'rgb(0, 115, 211)',
        border: '1px solid rgb(0, 115, 211)'
      },
      warning: {
        backgroundColor: 'rgb(248, 170, 15)',
        border: '1px solid rgb(248, 170, 15)'
      },
      success: {
        backgroundColor: colors.lightGreen,
        border: `1px solid ${colors.lightGreen}`
      }
    },
    text: {
      base: {
        paddingRight: '23px',
        width: '100%',
        ...makeTextStyle(fontWeights.regular, '12px'),
        lineHeight: 1.25,
        color: colors.darkGray2
      }
    },
    textContainer: {
      display: 'flex',
      paddingTop: '13px',
      paddingRight: '13px',
      paddingBottom: '13px',
      paddingLeft: '19px',
      backgroundColor: colors.white,
      border: '1px solid rgb(206, 214, 218)',
      borderTopRightRadius: '2px',
      borderBottomRightRadius: '2px'
    },
    cross: {
      width: '12px',
      height: '12px',
      transform: 'rotate(45deg)',
      paddingRight: '13px',
      cursor: 'pointer'
    }
  };

  render () {
    const { styles } = this.constructor;
    const { currentToast } = this.props;

    // Render empty if there is no toast to show
    if (!currentToast) {
      return (
        <div />
      );
    }
    // Visualize the toast
    const type = currentToast.get('type');
    const entityType = currentToast.get('entityType');
    const entity = currentToast.get('entity');
    return (
      <div style={styles.container}>
        <div style={[ styles.icon.base, styles.icon[type] ]}>
        <CompletedSVG color={colors.white} />
        </div>
        <div style={styles.textContainer}>
          <div style={[ styles.text.base ]}>
            { type === 'success' && <SuccessMessage entity={entity} entityType={entityType}/> }
          </div>
          <div onClick={this.props.popToast}><PlusSVG color='#aab5b8' style={styles.cross}/></div>
        </div>
      </div>
    );
  }

}
