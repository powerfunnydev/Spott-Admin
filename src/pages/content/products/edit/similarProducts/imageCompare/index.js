import React, { Component, PropTypes } from 'react';
import { reduxForm, Field, SubmissionError } from 'redux-form/immutable';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { fromJS } from 'immutable';
import Modal from '../../../../../_common/components/persistModal';
import { colors } from '../../../../../_common/styles';

const dialogStyle = {
  overlay: {
    display: 'flex',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.80)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  content: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'relative',
    backgroundColor: 'transparent',
    border: 'none',
    fontFamily: 'Rubik-Regular',
    fontWeight: 'normal',
    width: '100%',
    // Set width and center horizontally
    minWidth: 200,
    maxWidth: 800,
    // Internal padding
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '100%',
    overflow: 'auto'
  }
};
@connect(null, (dispatch) => ({

}))
@Radium
export default class ImageCompareModal extends Component {

  static propTypes = {
    onClose: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
  }

  static styles = {
    content: {
      display: 'flex',
      width: '100%'
    },
    productsContainer: {
      minWidth: '210px',
      height: '300px',
      backgroundColor: colors.lightGray4,
      borderRight: `solid 1px ${colors.lightGray2}`,
      padding: 24
    },
    selectedProduct: {
      backgroundColor: colors.white,
      width: 162,
      height: 162,
      border: `solid 1px ${colors.lightGray2}`
    },
    similarProductsContainer: {
      width: '100%',
      backgroundColor: colors.white
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { _activeLocale, currentProduct, defaultLocale } = this.props;
    console.log('currentProduct', currentProduct && currentProduct.toJS());
    return (
      <Modal
        cancelButtonText='Done'
        isOpen
        noContentStyle
        style={dialogStyle}
        title='Image Compare'
        onClose={this.props.onClose}>
        <div style={styles.content}>
          <div style={styles.productsContainer}>
            <div style={styles.selectedProduct}>
              <img src={currentProduct.getIn([ 'logo', _activeLocale, 'url' ]) && `${currentProduct.getIn([ 'logo', _activeLocale, 'url' ])}?height=203&width=360` ||
                      currentProduct.getIn([ 'logo', defaultLocale, 'url' ]) && `${currentProduct.getIn([ 'logo', defaultLocale, 'url' ])}?height=203&width=360`}
                style={{ width: 160, height: 160, objectFit: 'scale-down' }}/>
            </div>
          </div>
          <div style={styles.similarProductsContainer}>
            similar prods
          </div>
        </div>
      </Modal>
    );
  }
}
