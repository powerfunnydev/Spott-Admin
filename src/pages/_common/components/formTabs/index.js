import './style.css';
import React, { Component, PropTypes } from 'react';
import { Field } from 'redux-form/immutable';
import Radium from 'radium';
import ReactTabs from 'react-simpletabs';
import publishStatus from '../../../../constants/publishStatusTypes';
import SelectionDropdown from '../selectionDropdown';

@Radium
export class Tabs extends Component {
  static propTypes = {
    activeTab: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    children: PropTypes.node.isRequired,
    publishStatusDisabled: PropTypes.bool,
    showPublishStatus: PropTypes.bool,
    onBeforeChange: PropTypes.func,
    onChange: PropTypes.func
  }

  static styles = {
    dropdownContainer: {
      position: 'absolute',
      right: 0,
      top: 0
    },
    dropdown: {
      minWidth: '110px'
    },
    container: {
      position: 'relative'
    }
  }
  render () {
    const { showPublishStatus, children, activeTab, publishStatusDisabled, onBeforeChange, onChange } = this.props;
    const { styles } = this.constructor;
    let tabActive = activeTab;
    if (typeof tabActive === 'string') {
      tabActive = parseInt(tabActive, 10);
    }
    return (
      <div style={styles.container}>
        <ReactTabs tabActive={tabActive} onAfterChange={onChange} onBeforeChange={onBeforeChange}>
          {React.Children.toArray(children)}
        </ReactTabs>
        {showPublishStatus && <div style={styles.dropdownContainer}>
          <Field
            component={SelectionDropdown}
            disabled={publishStatusDisabled}
            getItemText={(ps) => (publishStatus[ps])}
            name='publishStatus'
            options={Object.keys(publishStatus)}
            placeholder='Publish Status'
            style={styles.dropdown}/>
          </div>}
      </div>
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
