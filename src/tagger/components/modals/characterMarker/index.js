import Radium from 'radium';
import React, { Component, PropTypes } from 'react';
import ReactModal from 'react-modal';
import { reduxForm } from 'redux-form/immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import * as characterActions from '../../../actions/character';
import characterMarkerSelector from '../../../selectors/characterMarker';
import CharacterSearch from './search';
import { buttonStyle, dialogStyle, modalStyle } from '../styles';

@reduxForm({
  fields: [ 'characterId' ],
  form: 'createCharacterMarker',
  // Get the form state.
  getFormState: (state, reduxMountPoint) => state.get(reduxMountPoint)
}, characterMarkerSelector, {
  onCancel: characterActions.createCharacterMarkerCancel,
  onSubmit: characterActions.createCharacterMarkerModal,
  searchCharacters: characterActions.searchCharacters
})
@Radium
export default class CreateCharacterMarker extends Component {

  static propTypes = {
    characterSearchResult: ImmutablePropTypes.map.isRequired,
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    initializeForm: PropTypes.func.isRequired,
    searchCharacters: PropTypes.func.isRequired,
    // Callback for closing the dialog and clearing the form.
    onCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func
  };

  constructor (props) {
    super(props);
    this.onCancel = ::this.onCancel;
    this.onRequestClose = ::this.onRequestClose;
    this.onCharacterSelect = ::this.onCharacterSelect;
  }

  onCancel (e) {
    e.preventDefault();
    this.props.onCancel();
  }

  onRequestClose () {
    this.props.onCancel();
  }

  onCharacterSelect (character) {
    this.props.fields.characterId.onChange(character && character.get('id'));
  }

  render () {
    const { fields: { characterId }, handleSubmit, characterSearchResult, searchCharacters, onSubmit } = this.props;

    return (
      <ReactModal
        isOpen
        style={dialogStyle}
        onRequestClose={this.onRequestClose}>
        <form noValidate onSubmit={handleSubmit}>
          <div style={modalStyle.content}>
            <h1 style={modalStyle.title}>Add character</h1>

            <h3 style={modalStyle.subtitle}>Find character</h3>

            <div style={modalStyle.search}>
              <CharacterSearch
                focus
                options={characterSearchResult.get('data').toArray()}
                search={searchCharacters}
                onOptionSelected={this.onCharacterSelect} />
              {characterId.error === 'required' && <span style={modalStyle.error}>Character is required.</span>}
            </div>

          </div>

          <div style={modalStyle.footer}>
            <button key='cancel' style={[ buttonStyle.base, buttonStyle.cancel ]} onClick={this.onCancel}>Cancel</button>
            <button key='save' style={[ buttonStyle.base, buttonStyle.save ]} onClick={onSubmit}>Done</button>
          </div>
        </form>
      </ReactModal>
    );
  }

}
