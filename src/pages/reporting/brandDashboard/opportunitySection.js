import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { colors, fontWeights, makeTextStyle, mediaQueries } from '../../_common/styles';
import Arrow from './images/arrow';

@Radium
export default class OpportunitySection extends Component {

  static propTypes = {
    children: PropTypes.node,
    isLoading: PropTypes.bool,
    style: PropTypes.object,
    title: PropTypes.string
  };

  constructor (props) {
    super(props);
    this.handleClick = ::this.handleClick;
    this.state = { open: false };
  }

  handleClick (e) {
    e.preventDefault();
    this.setState({ open: !this.state.open });
  }

  static styles = {
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
    container: {
      border: `solid 1px ${colors.lightGray2}`,
      borderRadius: 4
    },
    header: {
      base: {
        backgroundColor: colors.lightGray4,
        height: 50,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15
      },
      active: {
        borderBottom: `solid 1px ${colors.lightGray2}`,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0
      }
    },
    title: {
      ...makeTextStyle(fontWeights.medium, '1.063em'),
      color: colors.black2,
      textAlign: 'center'
    },
    content: {
      padding: 24
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { children, style, title } = this.props;
    const { open } = this.state;
    return (
      <div style={[ styles.container, style ]}>
        <div style={[ styles.header.base, open && styles.header.active ]} onClick={this.handleClick}>
          <div />
          <div style={styles.title}>{title}</div>
          <Arrow color={colors.lightGray3} position={open ? 'UP' : 'DOWN'} style={{ alignSelf: 'flex-end' }}/>
        </div>
        {open && <div style={styles.content}>{children}</div>}
      </div>
    );
  }
}
