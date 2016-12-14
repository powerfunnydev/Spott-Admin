import React, { Component, PropTypes } from 'react';
import Radium from 'radium';

@Radium
export default class List extends Component {

  static propTypes = {
    Item: PropTypes.func.isRequired,
    options: PropTypes.array.isRequired,
    style: PropTypes.object,
    onOptionSelected: PropTypes.func.isRequired
  };

  static styles = {
    message: {
      alignItems: 'center',
      backgroundColor: 'rgb(240, 242, 243)',
      borderBottom: 'none',
      color: 'rgb(22, 22, 22)',
      cursor: 'default',
      display: 'flex',
      fontFamily: 'Rubik-Regular',
      fontSize: '14px',
      height: 40,
      justifyContent: 'center',
      textAlign: 'center'
    },
    container: {
      maxHeight: 200,
      listStyleType: 'none',
      margin: '5px 0 0 0',
      overflowY: 'scroll',
      padding: 0,
      width: '394px',
      position: 'fixed',
      zIndex: 0,
      backgroundColor: 'white',
      borderTopLeftRadius: '4px',
      borderTopRightRadius: '4px',
      borderBottomLeftRadius: '10px',
      borderBottomRightRadius: '10px',
      boxShadow: '0px 0px 10px 2px rgba(190, 190, 190, .7)'
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { Item, options, style = {}, onOptionSelected } = this.props;

    return (
      <ul style={[ styles.container, style.container ]}>
        <li style={[ styles.message, style.message ]}>{options.length === 0 ? 'No results' : 'Search results'}</li>
        {options.map((option) => (<Item key={option.get('id')} option={option} onClick={onOptionSelected} />))}
      </ul>
    );
  }
}
