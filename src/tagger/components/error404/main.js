import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updatePath } from '../../actions/router';

const EXAMPLE_URL = '/episode/7e506614-8075-41c3-8eda-7f456abf803b/video/5a100710-5f3b-4634-8b8f-ed806bc3f77a';

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
  onThuisClick (e) {
    e.preventDefault();
    this.props.updatePath(EXAMPLE_URL);
  }

  static styles = {
    container: {
      // Make text readable on the dark background behind us
      color: '#fff',
      fontFamily: 'Rubik-Regular',
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
      color: 'white',
      fontFamily: 'Rubik-Bold'
    }
  };

  render () {
    const styles = this.constructor.styles;

    return (
      <div style={styles.container}>
        <div style={styles.contents}>
          <p>Please use the Apptvate CMS to enter the scene tagger.</p>
          <p>As an alternative for demo purposes, consider
             opening <a href={`#${EXAMPLE_URL}`} style={styles.link} onClick={this.onThuisClick.bind(this)}>this video</a> of
             an episode of the dutch series "Thuis".</p>
        </div>
      </div>
    );
  }

}
