import React, { Component, PropTypes } from 'react';
import Radium from 'radium';

@Radium
export default class Cross extends Component {

  static propTypes = {
    color: PropTypes.string,
    style: PropTypes.object
  };

  render () {
    const { color = '#17262b', style } = this.props;
    return <svg height='14' style={style} viewBox='0 0 14 14' width='14' xmlns='http://www.w3.org/2000/svg'><g fill='none' fillRule='evenodd'><path d='M-5-5h24v24H-5z'/><path d='M8.414 7l4.478-4.478a.67.67 0 0 0 .001-.943l-.472-.472a.665.665 0 0 0-.943 0L7 5.587 2.522 1.108a.67.67 0 0 0-.943-.001l-.472.472a.665.665 0 0 0 0 .943L5.587 7l-4.478 4.478a.67.67 0 0 0-.001.943l.472.472c.263.262.682.26.943 0L7 8.413l4.478 4.478a.67.67 0 0 0 .943.001l.472-.472a.665.665 0 0 0 0-.943L8.413 7z' fill={color}/></g></svg>;
  }
}
