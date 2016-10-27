import { Tab as ReactTab, Tabs as ReactTabs, TabList as ReactTabList, TabPanel as ReactTabPanel } from 'react-tabs';
import React, { Component, PropTypes } from 'react';

export class Tab extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired
  }
  render () {
    console.log('ReactTab', <ReactTab/>);
    return (<ReactTab>{this.props.children}</ReactTab>);
  }
}
export const Tabs = ReactTabs;
export class TabList extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired
  }
  render () {
    const childrenWithProps = this.props.children.map((child) => React.cloneElement(child, {
      type: 'Tab'
    })
    );
    console.log('childrenWithProps', childrenWithProps);
    return (<ReactTabList style={{ marginBottom: 0, borderWidth: 0 }}>{childrenWithProps}</ReactTabList>);
  }
}
// export const TabList = React.cloneElement(ReactTabList);

// export const TabList = React.cloneElement(ReactTabList, { style: { marginBottom: 0, borderWidth: 0 } });
export const TabPanel = ReactTabPanel;
