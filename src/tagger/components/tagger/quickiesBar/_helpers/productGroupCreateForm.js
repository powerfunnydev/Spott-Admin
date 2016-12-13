/* eslint-disable no-return-assign */
import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';

const plusIcon = require('../images/plus.svg');

@reduxForm({
  fields: [ 'name' ],
  // Get the form state.
  getFormState: (state, reduxMountPoint) => state.get(reduxMountPoint)
})
export default class ProductGroupCreateForm extends Component {

  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired
  };

  static styles = {
    addButton: {
      display: 'flex',
      marginLeft: 5
    },
    form: {
      backgroundColor: '#1c1c1c',
      display: 'flex',
      width: '100%',
      marginBottom: 1,
      padding: '7px 20px'
    },
    textInput: {
      backgroundColor: 'transparent',
      border: 'none',
      color: 'white',
      fontSize: '16px',
      height: 26,
      padding: 7,
      marginLeft: -7,
      width: '100%'
    }
  };

  render () {
    const { styles } = this.constructor;
    const { fields: { name }, handleSubmit } = this.props;

    return (
      <form noValidate style={styles.form} onSubmit={handleSubmit}>
        {/* We stop the propagation of the click event to prevent that the drop down closes. */}
        <input
          {...name}
          placeholder='Create new collection'
          ref={(c) => this._input = c}
          style={styles.textInput}
          type='text'
          onClick={(e) => e.stopPropagation()}/>
        <button style={styles.addButton} title='Create collection' onClick={(e) => e.stopPropagation()}>
          <img src={plusIcon} />
        </button>
      </form>
    );
  }
}
