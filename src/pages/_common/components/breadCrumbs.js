import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, colors, fontWeights, makeTextStyle } from '../styles';
import { routerPushWithReturnTo } from '../../../actions/global';
import Line from './line';

@connect(null, (dispatch) => ({
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch)
}))
@Radium
export default class BreadCrumbs extends Component {
  static propTypes = {
    hierarchy: PropTypes.array.isRequired,
    routerPushWithReturnTo: PropTypes.func.isRequired
  }

  static styles = {
    container: {
      paddingTop: '20px',
      paddingBottom: '20px',
      ...makeTextStyle(fontWeights.regular, '14px'),
      color: colors.lightGray3,
      backgroundColor: colors.white
    },
    clickable: {
      cursor: 'pointer'
    },
    last: {
      color: colors.veryDarkGray
    },
    row: {
      display: 'flex',
      flexDirection: 'row'
    }
  }

  render () {
    const { hierarchy } = this.props;
    const { styles } = this.constructor;
    return (
      <div>
        <Container style={styles.container}>
          <div style={styles.row}>
            {hierarchy.map((obj, index) => {
              return <div key={index} style={[ (index === (hierarchy.length - 1)) && styles.last, styles.clickable ]} onClick={() => { obj.url && this.props.routerPushWithReturnTo(obj.url); }}>{obj.title}{(index !== (hierarchy.length - 1)) && ' /\u00a0'}</div>;
            })}
          </div>
        </Container>
        <Line/>
      </div>
    );
  }
}
