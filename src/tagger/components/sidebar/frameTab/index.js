import Radium from 'radium';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { HotKeys } from 'react-hotkeys';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Product from './product';
import Character from './character';
import * as appearanceActions from '../../../actions/appearance';
import * as characterActions from '../../../actions/character';
import * as modalActions from '../../../actions/modals';
import * as productActions from '../../../actions/product';
import frameTabSelector from '../../../selectors/frameTab';
import PureRender from '../../_helpers/pureRenderDecorator';
import tabStyle from '../tabStyle';

@connect(frameTabSelector, (dispatch) => ({
  copyAppearances: bindActionCreators(appearanceActions.copy, dispatch),
  deleteCharacterOfScene: bindActionCreators(characterActions.deleteCharacterOfScene, dispatch),
  deleteProductOfScene: bindActionCreators(productActions.deleteProductOfScene, dispatch),
  editAppearance: bindActionCreators(modalActions.openUpdateAppearance, dispatch),
  hoverAppearance: bindActionCreators(appearanceActions.hover, dispatch),
  leaveAppearance: bindActionCreators(appearanceActions.leave, dispatch),
  selectAppearance: bindActionCreators(appearanceActions.select, dispatch),
  toggleSelectAppearance: bindActionCreators(appearanceActions.toggleSelect, dispatch)
}))
@Radium
@PureRender
export default class FrameTab extends Component {

  static propTypes = {
    // Data source
    characterTuples: ImmutablePropTypes.list.isRequired,
    copyAppearances: PropTypes.func.isRequired,
    deleteCharacterOfScene: PropTypes.func.isRequired,
    deleteProductOfScene: PropTypes.func.isRequired,
    editAppearance: PropTypes.func.isRequired,
    hoverAppearance: PropTypes.func.isRequired,
    hoveredAppearance: PropTypes.string,
    leaveAppearance: PropTypes.func.isRequired,
    productTuples: ImmutablePropTypes.list.isRequired,
    selectAppearance: PropTypes.func.isRequired,
    selectedAppearance: PropTypes.string,
    style: PropTypes.object,
    toggleSelectAppearance: PropTypes.func.isRequired
  };

  // The HotKeys compontent allows us to capture shortkeys. The key is the
  // function name of the handler that is passed to the HotKeys component.
  // The value is the name of the key that triggers the function.
  static keyMap = {
    copyAppearances: 'command+c'
  };

  render () {
    const { keyMap } = this.constructor;
    const { characterTuples, copyAppearances, deleteCharacterOfScene, deleteProductOfScene, editAppearance, hoveredAppearance, productTuples, selectedAppearance, hoverAppearance, leaveAppearance, style, selectAppearance, toggleSelectAppearance } = this.props;
    const handlers = { copyAppearances };

    return (
      <HotKeys handlers={handlers} keyMap={keyMap} role='tabpanel' style={style}>

        {/* Render the list of characters */}
        <div style={tabStyle.title}>
          Characters <span style={tabStyle.count}>{characterTuples.size}</span>
        </div>
        <ul style={tabStyle.list}>
          {characterTuples.map((characterTuple, index) => {
            const appearanceId = characterTuple.getIn([ 'sceneCharacter', 'appearanceId' ]);
            return (
              <Character
                appearanceId={appearanceId}
                character={characterTuple.get('character')}
                hovered={hoveredAppearance === appearanceId}
                key={index}
                sceneCharacter={characterTuple.get('sceneCharacter')}
                selected={selectedAppearance === appearanceId}
                onCopy={copyAppearances}
                onHover={hoverAppearance.bind(this, appearanceId)}
                onLeave={leaveAppearance}
                onRemove={deleteCharacterOfScene}
                onSelect={selectAppearance.bind(this, appearanceId)}
                onToggleSelect={toggleSelectAppearance.bind(this, appearanceId)} />
            );
          })}
        </ul>

        {/* Render the list of products */}
        <div style={tabStyle.title}>
          Products <span style={tabStyle.count}>{productTuples.size}</span>
        </div>
        <ul style={tabStyle.list}>
          {productTuples.map((productTuple, index) => {
            const appearanceId = productTuple.getIn([ 'sceneProduct', 'appearanceId' ]);
            return (
              <Product
                appearanceId={appearanceId}
                brand={productTuple.get('brand')}
                hovered={hoveredAppearance === appearanceId}
                key={index}
                product={productTuple.get('product')}
                selected={selectedAppearance === appearanceId}
                onCopy={copyAppearances}
                onEdit={editAppearance.bind(this, appearanceId)}
                onHover={hoverAppearance.bind(this, appearanceId)}
                onLeave={leaveAppearance}
                onRemove={deleteProductOfScene}
                onSelect={selectAppearance.bind(this, appearanceId)}
                onToggleSelect={toggleSelectAppearance.bind(this, appearanceId)} />
            );
          })}
        </ul>

      </HotKeys>
    );
  }

}
