import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updatePath } from '../../actions/router';

const HOME_URL = '/';

@connect(null, (dispatch) => {
  return { updatePath: bindActionCreators(updatePath, dispatch) };
})
export default class Error404 extends Component {

  static propTypes = {
    // Function immediatly dispatching the action for updating the current path (read: url)
    updatePath: React.PropTypes.func.isRequired
  };

  /**
   * For convenience during development, we provide a link for tagging an episode
   * from Thuis, in case the application is launched with an unknown url.
   */
  onHomeClick (e) {
    e.preventDefault();
    this.props.updatePath(HOME_URL);
  }

  static styles = {
    container: {
      // Make text readable on the dark background behind us
      color: '#000',
      fontFamily: 'SFUIText-Regular',
      fontSize: 24,
      // Make this div full-screen
      bottom: 0,
      left: 0,
      position: 'fixed',
      right: 0,
      top: 0
    },
    contents: {
      // Keep some distance from the border
      maxWidth: 500,
      padding: 55,
      // Center contents
      marginLeft: 'auto',
      marginRight: 'auto',
      textAlign: 'center'
    },
    link: {
      color: '#000',
      fontFamily: 'SFUIText-Semibold'
    }
  };

  render () {
    const styles = this.constructor.styles;

    return (
      <div style={styles.container}>
        <div style={styles.contents}>
          <p>Page not found. Please open
             the <a href={`#${HOME_URL}`} style={styles.link} onClick={this.onHomeClick.bind(this)}>homepage</a>.</p>
        </div>
      </div>
    );
  }

}
