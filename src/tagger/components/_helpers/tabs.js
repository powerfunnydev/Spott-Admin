import Radium from 'radium';
import React, { Component, PropTypes } from 'react';
import ScrollableDiv from './scrollableDiv';

export class TabPanel extends Component {

  static propTypes = {
    children: PropTypes.node.isRequired,
    style: PropTypes.object,
    tabName: PropTypes.string.isRequired
  };

  render () {
    const { style, tabName } = this.props;
    return (
      <ScrollableDiv
        aria-labelledby={`${tabName}-tab`}
        id={`${tabName}-panel`}
        style={style}>
        {this.props.children}
      </ScrollableDiv>
    );
  }

}

@Radium
export class Tab extends Component {

  static propTypes = {
    selected: PropTypes.bool.isRequired,
    tabName: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    title: PropTypes.string,
    onSelect: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onClick = ::this.onClick;
  }

  onClick (e) {
    e.preventDefault();
    // Make the clicked tab active
    this.props.onSelect(this.props.tabName);
  }

  static styles = {
    container: {
      backgroundColor: '#1c1c1c',
      // Allow both grow and shrink
      flex: '1 1',
      // Styling
      color: 'rgba(255, 255, 255, 0.5)',
      fontSize: '12px',
      fontWeight: 'bold',
      textAlign: 'center',
      textTransform: 'uppercase',
      // Cursor
      cursor: 'pointer',
      // Center text
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      // The default outline in Chrome is a bit invasive, we prefer a less screaming one instead.
      ':focus': {
        outline: '1px dotted #333'
      }
    },
    selected: {
      // Highlight currently active tab
      backgroundColor: '#252525',
      color: 'white'
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { selected, tabName, text, title } = this.props;
    return (
      <li
        aria-controls={`${tabName}-panel`}
        aria-selected={selected}
        id={`${tabName}-tab`}
        role='tab'
        style={[ styles.container, (selected ? styles.selected : {}) ]}
        tabIndex='0'
        title={title} onClick={this.onClick}>
        {text}
      </li>
    );
  }

}

@Radium
export class Tabs extends Component {

  static propTypes = {
    children: PropTypes.node,
    style: PropTypes.object
  };

  static styles = {
    container: {
      // Disable default ul styling
      paddingLeft: 0,
      marginBottom: 0,
      marginTop: 0,
      listStyle: 'none',
      // Distribute tabs in on a row in the free space
      display: 'flex'
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { children, style } = this.props;
    return (
      <ul role='tablist' style={[ styles.container, style ]}>
        {children}
      </ul>
    );
  }

}
