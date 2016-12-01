import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import Spinner from '../../../_common/spinner';

@Radium
export class Rows extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    isLoading: PropTypes.bool,
    style: PropTypes.object
  }

  static styles = {
    rows: {
      position: 'absolute',
      display: 'flex',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#f4f5f5',
      opacity: 0.5,
      justifyContent: 'center',
      alignItems: 'center'
    }
  }

  render () {
    const { children, isLoading, style } = this.props;
    const { styles } = this.constructor;
    return (
      <div style={[ { position: 'relative', minHeight: '5.25em' }, style ]}>
        {isLoading &&
          <div style={styles.rows}>
           <Spinner style={{ height: '1.875em', width: '1.875em' }}/>
          </div>
        }
        {children}
      </div>
    );
  }
}
