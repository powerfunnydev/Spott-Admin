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
    },
    section: {
      backgroundColor: colors.black1,
      borderRadius: 2,
      paddingBottom: '1em',
      paddingLeft: '1em',
      paddingRight: '1em',
      paddingTop: '1em'
    },
    description: {
      color: colors.warmGray,
      fontSize: '0.75em',
      lineHeight: 1.25,
      marginTop: 4
    },
    createCollectionButton: {
      borderRadius: 2,
      backgroundColor: colors.strongBlue,
      color: '#fff',
      fontSize: '0.75em',
      width: '100%',
      padding: 4,
      marginTop: 16
    }
  }

  render () {
    const { style } = this.props;
    const styles = this.constructor.styles;
    return (
      <div style={[ styles.container, style ]}>
        <div style={styles.section}>
          <h3 style={[ tabStyle.title, { padding: 0 } ]}>Collections</h3>
          <div style={styles.description}>
            These collections will be shown to the user when landing on an episode page.
          </div>
          <button style={styles.createCollectionButton}>
            Create collection
          </button>
        </div>
      </div>
    );
  }

}
