/* eslint-disable react/no-set-state */
import Radium from 'radium';
import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import * as characterActions from '../../../actions/character';
import characterMarkerSelector from '../../../selectors/characterMarker';
import CharacterSearch from './search';
import { buttonStyle, dialogStyle, modalStyle } from '../styles';

@connect(characterMarkerSelector, {
  onCancel: characterActions.createCharacterMarkerCancel,
  onSubmit: characterActions.createCharacterMarkerModal,
  searchCharacters: characterActions.searchCharacters
})
@Radium
export default class CreateCharacterMarker extends Component {

  static propTypes = {
    characterSearchResult: ImmutablePropTypes.map.isRequired,
    searchCharacters: PropTypes.func.isRequired,
    // Callback for closing the dialog and clearing the form.
    onCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func
  };

  constructor (props) {
    super(props);
    this.submit = ::this.submit;
    this.onCancel = ::this.onCancel;
    this.onRequestClose = ::this.onRequestClose;
    this.onCharacterSelect = ::this.onCharacterSelect;
    this.state = { characterId: null, errors: {} };
  }

  async submit (e) {
    e.preventDefault();
    // Validate
    if (this.state.characterId) {
      this.props.onSubmit({ characterId: this.state.characterId });
    } else {
      this.setState({ ...this.state, errors: { characterId: 'required' } });
    }
  }

  onCancel (e) {
    e.preventDefault();
    this.props.onCancel();
  }

  onRequestClose () {
    this.props.onCancel();
  }

  onCharacterSelect (character) {
    this.setState({
      ...this.state,
      characterId: character && character.get('id'),
      errors: {}
    });
  }

  render () {
    const { characterSearchResult, searchCharacters } = this.props;
    const { errors } = this.state;

    return (
      <ReactModal
        isOpen
        style={dialogStyle}
        onRequestClose={this.onRequestClose}>
        <form noValidate onSubmit={this.submit}>
          <div style={modalStyle.content}>
            <h1 style={modalStyle.title}>Add character</h1>

            <h3 style={modalStyle.subtitle}>Find character</h3>

            <div style={modalStyle.search}>
              <CharacterSearch
                focus
                options={characterSearchResult.get('data').toArray()}
                search={searchCharacters}
                onOptionSelected={this.onCharacterSelect} />
              {errors.characterId === 'required' && <span style={modalStyle.error}>Character is required.</span>}
            </div>

          </div>

          <div style={modalStyle.footer}>
            <button key='cancel' style={[ buttonStyle.base, buttonStyle.cancel ]} onClick={this.onCancel}>Cancel</button>
            <button key='save' style={[ buttonStyle.base, buttonStyle.save ]}>Done</button>
          </div>
        </form>
      </ReactModal>
    );
  }

}
