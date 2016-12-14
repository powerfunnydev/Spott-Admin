/* eslint-disable no-return-assign */
/* eslint-disable react/no-set-state */
import React, { Component, PropTypes } from 'react';

const plusIcon = require('../images/plus.svg');

export default class ProductGroupCreateForm extends Component {

  static propTypes = {
    onSubmit: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.submit = ::this.submit;
    this.state = { name: '' };
  }

  async submit (e) {
    e.preventDefault();
    // Submit form.
    await this.props.onSubmit(this.state);
    // Clear form.
    this.setState({
      ...this.state,
      name: ''
    });
  }

  onChangeField (field, e) {
    this.setState({
      ...this.state,
      [field]: e.target.value
    });
  }

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

    return (
      <form noValidate style={styles.form} onSubmit={this.submit}>
        <input
          placeholder='Create new collection'
          style={styles.textInput}
          type='text'
          value={this.state.name}
          onChange={this.onChangeField.bind(this, 'name')}/>
        <button style={styles.addButton} title='Create collection'>
          <img src={plusIcon} />
        </button>
      </form>
    );
  }
}
