import './style.css';
import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import ReactTabs from 'react-simpletabs';

@Radium
export class Tabs extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired
  }
  render () {
    const { children } = this.props;
    return (
      <ReactTabs>
        {React.Children.toArray(children)}
      </ReactTabs>
    );
  }
}

@Radium
export class Tab extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    title: PropTypes.string.isRequired
  }
  render () {
    const { children, title } = this.props;
    return (
      <ReactTabs.Panel title={title}>
        {children}
      </ReactTabs.Panel>
    );
  }
}
