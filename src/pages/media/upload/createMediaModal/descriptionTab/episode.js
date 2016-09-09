import React, { Component } from 'react';
import { Field } from 'redux-form/immutable';
import { errorTextStyle } from '../../../../_common/styles';
import createMediaStyles from '../styles';

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

export default class Episode extends Component {

  componentDidMount () {
    // Focus the first input. For some weird reason this does not work
    // when not wrapped in a setTimeout(). To be investigated if someone
    // has a lot of time, but for now it'll do.
    setTimeout(() => {
      document.getElementById('seriesName').focus();
    }, 0);
  }

  static styles = {
    info: {
      display: 'flex',
      marginTop: 20
    },
    small: {
      width: 70,
      marginRight: 20
    }
  };

  render () {
    const styles = this.constructor.styles;

    return (
      <div>
        <div>
          <Field
            component={renderField}
            label='Series name'
            name='seriesName'
            placeholder='e.g., Suits'
            style={createMediaStyles.inputText}
            type='text' />
        </div>

        <div style={styles.info}>
          <div style={styles.small}>
            <Field
              component={renderField}
              label='Season'
              max='9999'
              min='0'
              name='season'
              placeholder='SE'
              required
              style={createMediaStyles.inputText}
              type='number' />
          </div>
          <div style={styles.small}>
            <Field
              component={renderField}
              label='Episode'
              max='9999'
              min='0'
              name='episode'
              placeholder='EP'
              required
              style={createMediaStyles.inputText}
              type='number' />
          </div>
          <div>
          <Field
            component={renderField}
            label='Episode title'
            name='episodeTitle'
            placeholder='e.g, Dogfight'
            required
            style={createMediaStyles.inputText}
            type='text' />
          </div>
        </div>
      </div>
    );
  }
}
