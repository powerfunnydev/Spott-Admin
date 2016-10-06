import Radium from 'radium';
import React, { Component, PropTypes } from 'react';
import { reduxForm, Field } from 'redux-form/immutable';
import { buttonStyles, errorTextStyle } from '../../../../_common/styles';
import Checkbox from '../../../../_common/checkbox';
import createMediaStyles from '../styles';

function validate (values) {
  const errors = {};
  const { mediumExternalReferenceSource, mediumExternalReference } = values.toJS();

  // Validate mediumExternalReferenceSource
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

const renderField = (field) => {
  return (
    <div>
      <label htmlFor={field.name} style={createMediaStyles.label}>{field.label}</label>
      <input
        id={field.name}
        {...field}
        {...field.input} />
      {field.meta.touched && field.meta.error && <div style={errorTextStyle}>{field.meta.error}</div>}
    </div>
  );
};

@reduxForm({
  destroyOnUnmount: false,
  form: 'createMedia',
  validate
})
@Radium
export default class ProcessingTab extends Component {

  static propTypes = {
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
    // setTimeout(() => {
    //   document.getElementById('mediumExternalReferenceSource').focus();
    // }, 0);
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
    const { handleSubmit } = this.props;

    return (
      <form noValidate onSubmit={handleSubmit}>
        <div style={createMediaStyles.body}>
          <h1 style={createMediaStyles.title}>Processing</h1>

          <div style={createMediaStyles.message}>
            The uploaded video will be immediately processed and linked to the medium identified by:
          </div>

          <div>
            <Field
              component={renderField}
              label='Medium external reference source'
              name='mediumExternalReferenceSource'
              placeholder='e.g, system or zalando'
              style={createMediaStyles.inputText}
              type='text' />
          </div>

          <div style={styles.row}>
            <Field
              component={renderField}
              label='Medium external reference'
              name='mediumExternalReference'
              placeholder='e.g, abcdef1234abcdef1234abcdef1234'
              style={createMediaStyles.inputText}
              type='text' />
          </div>

          <Field
            component={Checkbox}
            label='Skip audio'
            name='skipAudio'
            style={styles.row} />

          <Field
            component={Checkbox}
            label='Skip scenes'
            name='skipScenes'
            style={styles.row} />

        </div>

        <div style={createMediaStyles.footer.container}>
          <button key='back' style={[ buttonStyles.base, buttonStyles.small, buttonStyles.gray, buttonStyles.first ]} onClick={this.onBack}>BACK</button>
          <button key='next' style={[ buttonStyles.base, buttonStyles.small, buttonStyles.blue ]} type='submit'>NEXT</button>
        </div>
      </form>
    );
  }

}
