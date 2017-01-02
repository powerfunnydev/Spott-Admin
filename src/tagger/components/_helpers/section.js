/* eslint-disable react/no-set-state */
import React, { Component, PropTypes } from 'react';
import Radium from 'radium';

const arrowImage = require('./images/arrow.svg');

@Radium
export default class Section extends Component {

  static propTypes = {
    activeStyle: PropTypes.object,
    children: PropTypes.node,
    title: PropTypes.node,
    onOpen: PropTypes.func
  };

  constructor (props) {
    super(props);
    this.handleClick = ::this.handleClick;
    this.state = { open: false };
  }

  handleClick (e) {
    e.preventDefault();
    const open = !this.state.open;
    this.setState({ open });
    if (open && this.props.onOpen) {
      // Wait until animation is done, otherwise there will be to many dispatch
      // events (because of cache hits)
      setTimeout(() => this.props.onOpen(), 250);
    }
  }

  static styles = {
    container: {
      base: {
        backgroundColor: '#202020',
        color: 'rgba(255, 255, 255, 0.5)',
        width: '100%',
        marginBottom: 1
      },
      active: {
        backgroundColor: '#2e2e2e',
        boxShadow: 'inset 4px 0 0 0 #0073d3',
        color: 'white'
      }
    },
    arrow: {
      base: {
        fontSize: '8px',
        transition: 'all 0.25s ease-out',
        paddingRight: 3
      },
      open: {
        transform: 'scale(1, -1)',
        transition: 'all 0.25s ease-in'
      },
      rotate: {
        transform: 'rotate(90deg)'
      }
    },
    title: {
      alignItems: 'center',
      cursor: 'pointer',
      display: 'flex',
      fontSize: '14px',
      justifyContent: 'space-between',
      padding: '11px 20px',
      transition: 'color 0.25s ease-in',
      userSelect: 'none'
    },
    content: {
      base: {
        maxHeight: 0,
        overflow: 'hidden',
        transition: 'max-height 0.25s ease-out'
      },
      open: {
        transition: 'max-height 0.25s ease-in',
        maxHeight: '10000px'
      }
    }
  }

  render () {
    const styles = this.constructor.styles;
    const { activeStyle, children, title } = this.props;
    const { open } = this.state;
    return (
      <div style={[ styles.container.base, open && styles.container.active, open && activeStyle ]}>
        <div style={styles.title} onClick={this.handleClick}>
          {title}
          <span style={[ styles.arrow.base, open && styles.arrow.open ]}>
            <img src={arrowImage} style={styles.arrow.rotate} />
          </span>
        </div>
        <div style={[ styles.content.base, open && styles.content.open ]}>{children}</div>
      </div>
    );
  }
}
