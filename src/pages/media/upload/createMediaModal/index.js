import React, { Component, PropTypes } from 'react';
import ReactModal from 'react-modal';
import { DESCRIPTION_TAB, SOURCE_VIDEO_TAB, /* ADDITIONAL_ASSETS_TAB, */ PROCESSING_TAB, CONFIRM_TAB } from '../../../../constants/createMediaTabTypes';
import Tabs from './tabs';
import DescriptionTab from './descriptionTab';
import SourceVideoTab from './sourceVideoTab';
// import AdditionalAssetsTab from './additionalAssetsTab';
import ProcessingTab from './processingTab';
import ConfirmTab from './confirmTab';

const crossImage = require('./cross.svg');

/**
 * Dialog style used for this modal.
 * Note: get merged with defaults by react-modal
 */
const dialogStyle = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.10)'
  },
  content: {
    fontFamily: 'Rubik-Regular',
    fontWeight: 'normal',
    // Set width and center horizontally
    margin: 'auto',
    minWidth: 400,
    maxWidth: 550,
    // Internal padding
    padding: 0,
    // Fit height to content, centering vertically
    bottom: 'auto',
    top: '50%',
    transform: 'translateY(-50%)',
    overflow: 'visible'
  }
};

export default class CreateMediaModal extends Component {

  static propTypes = {
    currentMediaType: PropTypes.string.isRequired,
    currentTab: PropTypes.string.isRequired,
    initialMediumExternalReference: PropTypes.string,
    initialMediumExternalReferenceSource: PropTypes.string,
    onCancel: PropTypes.func.isRequired, // Callback for closing the dialog and clearing the form.
    onSelectMediaType: PropTypes.func.isRequired,
    onSelectTab: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onCloseClick = ::this.onCloseClick;
  }

  onCloseClick (e) {
    e.preventDefault();
    this.props.onCancel();
  }

  static styles = {
    container: {
      position: 'relative'
    },
    cross: {
      cursor: 'pointer',
      position: 'absolute',
      top: -45,
      right: -45
    }
  };

  render () {
    const { styles } = this.constructor;
    const {
      currentMediaType, currentTab, initialMediumExternalReferenceSource, initialMediumExternalReference,
      onCancel, onSelectMediaType, onSelectTab, onSubmit
    } = this.props;
    return (
      <ReactModal isOpen style={dialogStyle} onRequestClose={onCancel}>
        <div style={styles.container}>
          {/* Although this is a button, we chose a <div> for accessibility.
              The dialog can be canceled by pressing 'escape', so we remove the
              cross from tab focus. */}
          <div style={styles.cross} onClick={this.onCloseClick}>
            <img alt='Close' src={crossImage} style={styles.crossImage} />
          </div>
          <div>
            <Tabs currentTab={currentTab} onTabClick={onSelectTab} />

            <div>
              {currentTab === DESCRIPTION_TAB &&
                <DescriptionTab
                  currentMediaType={currentMediaType}
                  onSelectMediaType={onSelectMediaType}
                  onSubmit={onSelectTab.bind(this, SOURCE_VIDEO_TAB)} />}
              {currentTab === SOURCE_VIDEO_TAB &&
                <SourceVideoTab
                  onBack={onSelectTab.bind(this, DESCRIPTION_TAB)}
                  onSubmit={onSelectTab.bind(this, PROCESSING_TAB)} />}
              {/* currentTab === ADDITIONAL_ASSETS_TAB &&
                <AdditionalAssetsTab
                  onBack={onSelectTab.bind(this, SOURCE_VIDEO_TAB)}
                  onSubmit={onSelectTab.bind(this, CONFIRM_TAB)} /> */}
              {currentTab === PROCESSING_TAB &&
                <ProcessingTab
                  initialValues={{
                    mediumExternalReferenceSource: initialMediumExternalReferenceSource,
                    mediumExternalReference: initialMediumExternalReference
                  }}
                  onBack={onSelectTab.bind(this, SOURCE_VIDEO_TAB)}
                  onSubmit={onSelectTab.bind(this, CONFIRM_TAB)} />}
              {currentTab === CONFIRM_TAB &&
                <ConfirmTab
                  onBack={onSelectTab.bind(this, PROCESSING_TAB)}
                  onSubmit={onSubmit} />}
            </div>
          </div>
        </div>
      </ReactModal>
    );
  }

}
