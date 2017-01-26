import Radium from 'radium';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import * as appearanceActions from '../../../actions/appearance';
import * as characterActions from '../../../actions/character';
import * as modalActions from '../../../actions/modals';
import * as productActions from '../../../actions/product';
import frameTabSelector from '../../../selectors/frameTab';
import PureRender from '../../_helpers/pureRenderDecorator';
import tabStyle from '../tabStyle';
import colors from '../../colors';
import Collections from './list';

@connect(frameTabSelector, (dispatch) => ({
}))
@Radium
@PureRender
export default class CollectionTab extends Component {

  static propTypes = {
    style: PropTypes.object
  };

  static styles = {
    container: {
      backgroundColor: colors.black3,
      paddingBottom: '1.25em',
      paddingLeft: '1.25em',
      paddingRight: '1.25em',
      paddingTop: '1.25em'
    }
  }

  render () {
    const { style } = this.props;
    const styles = this.constructor.styles;
    return (
      <div style={[ styles.container, style ]}>
        <Collections />
      </div>
    );
  }

}
