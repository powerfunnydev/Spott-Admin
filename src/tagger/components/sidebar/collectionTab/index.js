import Radium from 'radium';
import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import frameTabSelector from '../../../selectors/frameTab';
import PureRender from '../../_helpers/pureRenderDecorator';
import colors from '../../colors';
import Collections from './list';
import UnassignedProducts from './list/unassignedProducts';

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
        <UnassignedProducts />
        <Collections />
      </div>
    );
  }

}
