import './style.css';
import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import ReactTabs from 'react-simpletabs';

@Radium
export class Tabs extends Component {
  static propTypes = {
    activeTab: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    children: PropTypes.node.isRequired,
    onChange: PropTypes.func
  }
  render () {
    const { children, activeTab, onChange } = this.props;
    let tabActive = activeTab;
    if (typeof tabActive === 'string') {
      tabActive = parseInt(tabActive, 10);
    }
    return (
      <ReactTabs tabActive={tabActive} onAfterChange={onChange}>
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
