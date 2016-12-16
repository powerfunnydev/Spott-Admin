import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import CreateCharacterMarker from './characterMarker';
import AddAppearanceToSimilarFrames from './addAppearanceToSimilarFrames';
import { CreateProductMarker, UpdateProductMarker } from './productMarker';
import WhatToTag from './whatToTag';
import * as modalActions from '../../actions/modals';
import * as productActions from '../../actions/product';
import modalsSelector from '../../selectors/modals';

@connect(modalsSelector, (dispatch) => ({
  clearProductSuggestions: bindActionCreators(productActions.clearProductSuggestions, dispatch),
  closeModal: bindActionCreators(modalActions.close, dispatch),
  openCreateCharacterMarker: bindActionCreators(modalActions.openCreateCharacterMarker, dispatch),
  openCreateProductMarker: bindActionCreators(modalActions.openCreateProductMarker, dispatch),
  seeProductSuggestions: bindActionCreators(modalActions.seeProductSuggestions, dispatch)
}))
@Radium
export default class Modals extends Component {

  static propTypes = {
    characters: ImmutablePropTypes.list,
    clearProductSuggestions: PropTypes.func.isRequired,
    // Callback for closing the dialog
    closeModal: PropTypes.func.isRequired,
    // The unique identifier of the modal dialog currently active, if any
    currentModal: PropTypes.string,
    openCreateCharacterMarker: PropTypes.func.isRequired,
    openCreateProductMarker: PropTypes.func.isRequired,
    productSuggestions: ImmutablePropTypes.list,
    region: PropTypes.object,
    seeProductSuggestions: PropTypes.func.isRequired,
    tooltip: PropTypes.shape({
      imageUrl: PropTypes.string.isRequired,
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired
    })
  };

  static styles = {
    // tooltip: enlarged image
    image: {
      image: {
        maxWidth: '100%',
        maxHeight: '100%',
        borderRadius: '0.25em'
      },
      wrapper: {
        backgroundColor: 'white',
        border: 'solid 1px #ced6da',
        borderRadius: '0.25em',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.25)',
        height: 300,
        maxWidth: 300,
        position: 'fixed',
        zIndex: 1
      }
    }
  };

  /**
   * Render the modal to show (identified by the state's currentModal string), if any.
   */
  render () {
    const styles = this.constructor.styles;
    const {
      characters, clearProductSuggestions, closeModal, currentModal,
      tooltip, openCreateCharacterMarker, openCreateProductMarker, productSuggestions,
      region, seeProductSuggestions
    } = this.props;
    return (
      <div id='kristof'>
        {/* Product tooltip used to show a larger image of a product when searching a product. */}
        {tooltip &&
          <div style={[ styles.image.wrapper, { top: tooltip.y, right: tooltip.x } ]}>
            <img
              src={`${tooltip.imageUrl}?height=300&width=300`}
              style={styles.image.image} />
          </div>}

        {currentModal === 'whatToTag' &&
          <WhatToTag
            onCloseModal={closeModal}
            onOpenCreateCharacterMarker={openCreateCharacterMarker}
            onOpenCreateProductMarker={openCreateProductMarker} />}
        {currentModal === 'createCharacterMarker' &&
          <CreateCharacterMarker />}
        {currentModal === 'createProductMarker' &&
          <CreateProductMarker
            allowProductSuggestions={region && region.width > 0 && region.height > 0}
            characters={characters}
            productSuggestions={productSuggestions}
            onClearProductSuggestions={clearProductSuggestions}
            onSeeProductSuggestions={seeProductSuggestions} />}
        {currentModal === 'updateProductMarker' &&
          <UpdateProductMarker
            allowProductSuggestions={region && region.width > 0 && region.height > 0}
            characters={characters} />}
        {currentModal === 'addAppearanceToSimilarFrames' &&
          <AddAppearanceToSimilarFrames />}
      </div>
    );
  }

}
