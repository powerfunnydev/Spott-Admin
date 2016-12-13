/* eslint-disable no-return-assign */
import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import ImmutablePropTypes from 'react-immutable-proptypes';

const addIcon = require('../images/add.svg');

@reduxForm({
  fields: [ 'id', 'name', 'products' ],
  // Get the form state.
  getFormState: (state, reduxMountPoint) => state.get(reduxMountPoint)
})
export default class ProductGroupEditForm extends Component {

  static propTypes = {
    currentProductGroup: ImmutablePropTypes.map,
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    initializeForm: PropTypes.func.isRequired
  };

  componentWillMount () {
    const { currentProductGroup } = this.props;
    // Initialize form fields
    if (currentProductGroup) { // Update
      this.props.initializeForm(currentProductGroup.toJS());
    }
  }

  // Auto focus the name field, when editing (if currentProductGroup is present).
  componentDidMount () {
    if (this.props.currentProductGroup) {
      setTimeout(() => this._input.focus(), 0);
    }
  }

  static styles = {
    addButton: {
      display: 'flex',
      marginLeft: 5,
      marginRight: 15
    },
    form: {
      display: 'flex',
      width: '100%'
    },
    textInput: {
      backgroundColor: 'transparent',
      border: 'none',
      color: 'white',
      fontSize: '16px',
      height: 25,
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
          placeholder='Edit collection'
          ref={(c) => this._input = c}
          style={styles.textInput}
          type='text'
          onClick={(e) => e.stopPropagation()}/>
        <button style={styles.addButton} title='Edit collection' onClick={(e) => e.stopPropagation()}>
          <img src={addIcon} />
        </button>
      </form>
    );
  }
}
