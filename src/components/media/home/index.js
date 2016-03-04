import Radium from 'radium';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { buttonStyles } from '../../_common/styles';
import { updatePath } from '../../../actions/router';
import homeSelector from '../../../selectors/home';

// TODO: Support "See History"
@connect(homeSelector, (dispatch) => {
  return { updatePath: bindActionCreators(updatePath, dispatch) };
})
@Radium
export default class Home extends Component {

  static propTypes = {
    updatePath: PropTypes.func.isRequired,
    username: PropTypes.string.isRequired
  };

  constructor (props) {
    super(props);
    this.onNewUploadClick = ::this.onNewUploadClick;
    // this.onSeeHistoryClick = ::this.onSeeHistoryClick;
  }

  onNewUploadClick (e) {
    e.preventDefault();
    this.props.updatePath('/media/upload');
  }

  // onSeeHistoryClick (e) {
  //   e.preventDefault();
  //   ...
  // }

  static styles = {
    text: {
      color: 'white',
      fontFamily: 'Rubik-Light',
      fontSize: '42px',
      marginBottom: 30
    },
    username: {
      fontFamily: 'Rubik-Regular'
    }
  }

  render () {
    const { username } = this.props;
    const styles = this.constructor.styles;
    return (
      <div>
        <div style={styles.text}>
          Welcome <span style={styles.username}>{username}</span>,<br/>
          What would you like to do?
        </div>
        <div>
          <a href='#/media/upload' style={[ buttonStyles.base, buttonStyles.pink, buttonStyles.first, buttonStyles.large ]} onClick={this.onNewUploadClick}>New upload</a>
          {/* <button style={[ buttonStyles.base, buttonStyles.large,buttonStyles.bordered ]}>See History</button> */}
        </div>
      </div>
    );
  }
}
