import Radium from 'radium';
import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form/immutable';
import { buttonStyles } from '../../../../_common/styles';
import createMediaStyles from '../styles';

@reduxForm({
  destroyOnUnmount: false,
  fields: [],
  form: 'createMedia',
  getFormState: (state, reduxMountPoint) => state.get(reduxMountPoint) // Get the `form` state (reduxMountPoint = 'form' by default).
})
@Radium
export default class AdditionalAssetsTab extends Component {

  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onBack = ::this.onBack;
  }

  onBack (e) {
    e.preventDefault();
    this.props.onBack();
  }

  render () {
    const { handleSubmit } = this.props;
    return (
      <form noValidate onSubmit={handleSubmit}>
        <div style={createMediaStyles.body}>
          <h1 style={createMediaStyles.title}>Additional assets</h1>

          {/* TODO: Not implemented yet. */}
        </div>
        <div style={createMediaStyles.footer.container}>
          <button key='back' style={[ buttonStyles.base, buttonStyles.small, buttonStyles.gray, buttonStyles.first ]} onClick={this.onBack}>BACK</button>
          <button key='next' style={[ buttonStyles.base, buttonStyles.small, buttonStyles.blue ]} type='submit'>NEXT</button>
        </div>
      </form>
    );
  }

}
