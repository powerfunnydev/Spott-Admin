import Radium from 'radium';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updatePath } from '../../../actions/router';
import * as mediaActions from '../../../actions/media';
import { loginWithAuthenticationToken } from '../actions';
import uploadSelector from '../../../selectors/upload';
import Cancelled from './cancelled';
import Completed from './completed';
import CreateMediaModal from './createMediaModal';
import Failed from './failed';
import Progress from './progress';

// (state, props) =>
@connect((state, { location: { query } }) => ({
  authenticationToken: query.auth,
  initialMediumExternalReferenceSource: query.mediumExternalReferenceSource,
  initialMediumExternalReference: query.mediumExternalReference,
  ...uploadSelector(state)
}), (dispatch) => ({
  cancelWizard: bindActionCreators(mediaActions.cancelWizard, dispatch),
  createMedia: bindActionCreators(mediaActions.createMedia, dispatch),
  loginWithAuthenticationToken: bindActionCreators(loginWithAuthenticationToken, dispatch),
  selectMediaType: bindActionCreators(mediaActions.selectMediaType, dispatch),
  selectTab: bindActionCreators(mediaActions.selectTab, dispatch),
  updatePath: bindActionCreators(updatePath, dispatch)
}))
@Radium
export default class Upload extends Component {

  static propTypes = {
    authenticationToken: PropTypes.string,
    cancelWizard: PropTypes.func.isRequired,
    createMedia: PropTypes.func.isRequired,
    currentMediaType: PropTypes.string.isRequired,
    currentTab: PropTypes.string, // Only when status = 'wizard'
    initialMediumExternalReference: PropTypes.string,
    initialMediumExternalReferenceSource: PropTypes.string,
    jobName: PropTypes.string,
    loginWithAuthenticationToken: PropTypes.func.isRequired,
    progress: PropTypes.number, // Only when status = 'progress'
    remainingTime: PropTypes.number, // Only when status = 'progress'. In seconds. May be null (unknown).
    selectMediaType: PropTypes.func.isRequired,
    selectTab: PropTypes.func.isRequired,
    status: PropTypes.string.isRequired,
    updatePath: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onDone = ::this.onDone;
  }

  // Auto login with the authenticationToken that comes from the CMS.
  // TODO: can be removed when Apptvate and CMS are merged (= same domain).
  componentDidMount () {
    const authenticationToken = this.props.authenticationToken;
    if (authenticationToken) {
      this.props.loginWithAuthenticationToken(authenticationToken);
    }
  }

  onDone () {
    this.props.updatePath('/media');
  }

  static styles = {
    container: {
      width: '100%',
      overflow: 'hidden'
    }
  }

  render () {
    const {
      cancelWizard, createMedia, currentMediaType, currentTab, initialMediumExternalReference,
      initialMediumExternalReferenceSource, jobName, progress, remainingTime,
      selectMediaType, selectTab, status
    } = this.props;
    const styles = this.constructor.styles;
    return (
      <div style={styles.container}>
        {status === 'cancelled' && <Cancelled onOkay={this.onDone} />}
        {status === 'completed' && <Completed name={jobName} onOkay={this.onDone} />}
        {status === 'failed' && <Failed name={jobName} onCancel={this.onDone} />}
        {status === 'progress' && <Progress name={jobName} progress={progress} remainingTime={remainingTime} />}
        {status === 'wizard' &&
          <CreateMediaModal
            currentMediaType={currentMediaType}
            currentTab={currentTab}
            initialMediumExternalReference={initialMediumExternalReference}
            initialMediumExternalReferenceSource={initialMediumExternalReferenceSource}
            onCancel={cancelWizard}
            onSelectMediaType={selectMediaType}
            onSelectTab={selectTab}
            onSubmit={createMedia} />}
      </div>
    );
  }

}
