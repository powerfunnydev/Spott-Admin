import Radium from 'radium';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { reduxForm } from 'redux-form';
import { buttonStyles, errorTextStyle } from '../../../../_common/styles';
import Checkbox from '../../../../_common/checkbox';
import createMediaStyles from '../styles';

function validate ({ mediumExternalReferenceSource, mediumExternalReference }) {
  const errors = {};
  // Validate seriesName
  if (typeof mediumExternalReferenceSource === 'undefined' || mediumExternalReferenceSource === '') {
    errors.mediumExternalReferenceSource = 'Medium external reference source is required.';
  }
  // Validate mediumExternalReference
  if (typeof mediumExternalReference === 'undefined' || mediumExternalReference === '') {
    errors.mediumExternalReference = 'Medium external reference is required.';
  }
  // Done, return
  return errors;
}

@reduxForm({
  destroyOnUnmount: false,
  fields: [ 'mediumExternalReference', 'mediumExternalReferenceSource', 'skipAudio', 'skipScenes' ],
  form: 'createMedia',
  getFormState: (state, reduxMountPoint) => state.get(reduxMountPoint), // Get the `form` state (reduxMountPoint = 'form' by default).
  validate
})
@Radium
export default class ProcessingTab extends Component {

  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    submitFailed: PropTypes.bool.isRequired,
    onBack: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onBack = ::this.onBack;
  }

  componentDidMount () {
    // Focus the first input
    ReactDOM.findDOMNode(this.mediumExternalReferenceSourceInput).focus();
  }

  onBack (e) {
    e.preventDefault();
    this.props.onBack();
  }

  static styles = {
    row: {
      marginTop: 20
    }
  };

  // TODO: this should only be for admins, and should be optional.
  render () {
    const styles = this.constructor.styles;
    const { fields: { mediumExternalReference, mediumExternalReferenceSource, skipAudio, skipScenes }, handleSubmit, submitFailed } = this.props;

    return (
      <form noValidate onSubmit={handleSubmit}>
        <div style={createMediaStyles.body}>
          <h1 style={createMediaStyles.title}>Processing</h1>

          <div style={createMediaStyles.message}>
            The uploaded video will be immediately processed and linked to the medium identified by:
          </div>

          <div>
            <label htmlFor='mediumExternalReferenceSource' style={createMediaStyles.label}>Medium external reference source</label>
            <input id='mediumExternalReferenceSource' placeholder='e.g, system or zalando'
              ref={(x) => { this.mediumExternalReferenceSourceInput = x; }}
              style={createMediaStyles.inputText} type='text' {...mediumExternalReferenceSource} />
            {submitFailed && mediumExternalReferenceSource.touched && mediumExternalReferenceSource.error && <div style={errorTextStyle}>{mediumExternalReferenceSource.error}</div>}
          </div>

          <div style={styles.row}>
            <label htmlFor='mediumExternalReference' style={createMediaStyles.label}>Medium external reference</label>
            <input id='mediumExternalReference' placeholder='e.g, abcdef1234abcdef1234abcdef1234' style={createMediaStyles.inputText} type='text' {...mediumExternalReference} />
            {submitFailed && mediumExternalReference.touched && mediumExternalReference.error && <div style={errorTextStyle}>{mediumExternalReference.error}</div>}
          </div>

          <Checkbox field={skipAudio} label='Skip audio' style={styles.row} />
          <Checkbox field={skipScenes} label='Skip scenes' style={styles.row} />
        </div>

        <div style={createMediaStyles.footer.container}>
          <button key='back' style={[ buttonStyles.base, buttonStyles.small, buttonStyles.gray, buttonStyles.first ]} onClick={this.onBack}>BACK</button>
          <button key='next' style={[ buttonStyles.base, buttonStyles.small, buttonStyles.blue ]} type='submit'>NEXT</button>
        </div>
      </form>
    );
  }

}
