/* eslint-disable no-return-assign */
/* eslint-disable react/no-set-state */
import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

const addIcon = require('../images/add.svg');

export default class ProductGroupEditForm extends Component {

  static propTypes = {
    currentProductGroup: ImmutablePropTypes.map.isRequired,
    onSubmit: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.submit = ::this.submit;
    this.state = { name: '' };
  }

  componentWillMount () {
    // Initialize form field.
    this.setState({
      ...this.state,
      name: this.props.currentProductGroup.get('name')
    });
  }

  // Auto focus the name field, when editing (if currentProductGroup is present).
  componentDidMount () {
    setTimeout(() => this._input.focus(), 0);
  }

  async submit (e) {
    e.preventDefault();
    // Submit form.
    await this.props.onSubmit({
      ...this.props.currentProductGroup.toJS(),
      name: this.state.name
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

    return (
      <form noValidate style={styles.form} onSubmit={this.submit}>
        {/* We stop the propagation of the click event to prevent that the drop down closes. */}
        <input
          placeholder='Edit collection'
          ref={(c) => this._input = c}
          style={styles.textInput}
          type='text'
          value={this.state.name}
          onChange={this.onChangeField.bind(this, 'name')}
          onClick={(e) => e.stopPropagation()}/>
        <button style={styles.addButton} title='Edit collection' onClick={(e) => e.stopPropagation()}>
          <img src={addIcon} />
        </button>
      </form>
    );
  }
}
