import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import List from '../../_helpers/search/list';
import itemStyle from '../../_helpers/search/itemStyle';

@Radium
class ProductItem extends Component {

  static propTypes = {
    option: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onClick = ::this.onClick;
  }

  onClick (e) {
    e.preventDefault();
    this.props.onClick(this.props.option);
  }

  render () {
    const product = this.props.option;
    // imageUrl is optional
    return (
      <li style={itemStyle.item.base} onClick={this.onClick}>
        <div style={[ itemStyle.image, product.get('imageUrl') && { backgroundImage: `url('${product.get('imageUrl')}?width=96&height=96')` } ]}>&nbsp;</div>
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

  static styles = {
    container: {
      width: 310
    }
  };

  render () {
    const styles = this.constructor.styles;
    return (<List {...this.props} Item={ProductItem} style={styles} />);
  }

}
