import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import ImmutablePropTypes from 'react-immutable-proptypes';
import List from '../../_helpers/search/list';
import itemStyle from '../../_helpers/search/itemStyle';

@Radium
class CharacterItem extends Component {

  static propTypes = {
    option: ImmutablePropTypes.map.isRequired,
    onClick: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onClick = ::this.onClick;
  }

  // When the Immutable character was updated, trigger a render.
  shouldComponentUpdate ({ option: nextCharacter }) {
    const character = this.props.option;
    return character !== nextCharacter;
  }

  onClick (e) {
    e.preventDefault();
    this.props.onClick(this.props.option);
  }

  render () {
    const option = this.props.option;

    return (
      <li style={itemStyle.item.base} onClick={this.onClick}>
        <div style={[ itemStyle.image, option.get('portraitImageUrl') && { backgroundImage: `url('${option.get('portraitImageUrl')}?width=70&height=70')` } ]}>&nbsp;</div>
        <div style={itemStyle.text}>
          <span style={itemStyle.textMedium}>{option.get('name')}</span>
        </div>
      </li>
    );
  }

}

export default class CharacterList extends Component {

  static propTypes = {
    options: PropTypes.array.isRequired,
    onOptionSelected: PropTypes.func.isRequired
  };

  render () {
    return (<List {...this.props} Item={CharacterItem} />);
  }

}
