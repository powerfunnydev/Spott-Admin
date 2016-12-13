import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import List from '../../_helpers/search/list';
import itemStyle from '../../_helpers/search/itemStyle';
import colors from '../../colors';
import * as actions from '../../../../actions/global';

@connect(null, (dispatch) => ({
  showTooltip: bindActionCreators(actions.showTooltip, dispatch),
  hideTooltip: bindActionCreators(actions.hideTooltip, dispatch)
}))
@Radium
class ProductItem extends Component {

  static propTypes = {
    hideTooltip: PropTypes.func.isRequired,
    option: ImmutablePropTypes.map.isRequired,
    showTooltip: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onClick = ::this.onClick;
    this.onMouseEnter = ::this.onMouseEnter;
    this.onMouseLeave = ::this.onMouseLeave;
  }

  componentWillUnmount () {
    this.props.hideTooltip();
  }

  onClick (e) {
    e.preventDefault();
    this.props.onClick(this.props.option);
  }

  onMouseEnter (e) {
    e.preventDefault();
    const { top, right } = this._container.getClientRects()[0];
    this.props.showTooltip({ imageUrl: this.props.option.get('imageUrl'), x: right + 5, y: top });
  }

  onMouseLeave (e) {
    e.preventDefault();
    this.props.hideTooltip();
  }

  render () {
    const product = this.props.option;
    const tooltip = this.state.tooltip;
    const imageUrl = product.get('imageUrl');

    /* eslint-disable no-return-assign */
    return (
      <li ref={(c) => this._container = c} style={itemStyle.item.base} onClick={this.onClick}>
        <div
          style={[ itemStyle.image, imageUrl && { backgroundImage: `url('${imageUrl}?width=96&height=96')` } ]}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}>&nbsp;</div>
        <div style={itemStyle.text}>
          {product.get('brandName') && <span style={itemStyle.textBold}>{product.get('brandName')}&nbsp;</span>}
          <span style={itemStyle.textRegular}>{product.get('shortName')}</span>
        </div>
      </li>
    );
  }

}

export default class ProductList extends Component {

  static propTypes = {
    options: PropTypes.array.isRequired,
    onOptionSelected: PropTypes.func.isRequired
  };

  render () {
    return (<List {...this.props} Item={ProductItem} />);
  }

}
