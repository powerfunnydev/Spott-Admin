import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import Radium from 'radium';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Checkbox from '../../../_common/inputs/checkbox';
import Dropdown, { styles as dropdownStyles } from '../../../_common/components/actionDropdown';
import { colors } from '../../../_common/styles';

@Radium
export default class Spott extends Component {

  static propTypes = {
    checked: PropTypes.bool,
    deleteText: PropTypes.string,
    spott: ImmutablePropTypes.map.isRequired,
    onCheckboxChange: PropTypes.func,
    onDelete: PropTypes.func,
    onEdit: PropTypes.func
  };

  constructor (props) {
    super(props);
  }

  static styles = {
    checkbox: {
      position: 'absolute',
      top: '14px',
      left: '14px'
    },
    comment: {
      color: colors.darkerGray,
      fontSize: '0.75em',
      marginBottom: '1em'
    },
    container: {
      backgroundColor: colors.white,
      borderRadius: 2,
      overflow: 'hidden'
    },
    content: {
      padding: '1em'
    },
    dropdown: {
      position: 'absolute',
      top: '14px',
      right: '14px'
    },
    image: {
      display: 'inherit',
      overflow: 'hidden',
      width: '100%'
    },
    promoted: {
      color: colors.lightGray5,
      fontSize: '0.75em',
      marginBottom: '0.5em'
    },
    title: {
      color: colors.black20,
      fontSize: '0.875em',
      marginBottom: '0.5em'
    },
    topic: {
      borderBottom: `0.063rem solid ${colors.secondaryPink2}`,
      color: colors.black20,
      fontSize: '0.75em',
      fontWeight: 500,
      marginRight: '0.5em'
    },
    wrapper: {
      padding: '0.438em',
      position: 'relative',
      width: '14em'
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { checked, deleteText, spott, onCheckboxChange, onDelete, onEdit } = this.props;
    return (
      <div style={styles.wrapper}>
        { onCheckboxChange && <div style={styles.checkbox}>
          <Checkbox checked={checked} first onChange={onCheckboxChange}/>
        </div> }
        <Dropdown style={styles.dropdown}>
          {onEdit && <div key='onEdit' style={dropdownStyles.floatOption} onClick={(e) => { onEdit(e); }}>Edit</div>}
          {onEdit && onDelete && <div style={dropdownStyles.line}/>}
          {onDelete && <div key='onDelete' style={dropdownStyles.floatOption} onClick={(e) => { onDelete(e); }}>{deleteText || 'Remove'}</div>}
        </Dropdown>
        <div style={styles.container}>
          <img src={spott.getIn([ 'image', 'url' ])} style={styles.image}/>
          <div style={styles.content}>
            {spott.get('promoted') && <div style={styles.promoted}>Promoted</div>}
            <h2 style={styles.title}>{spott.get('title')}</h2>
            {spott.get('comment') &&
              <div style={styles.comment}>{spott.get('comment')}</div>}
            {spott.get('topics').map((topic) => <span key={topic.get('id')} style={styles.topic}>{topic.get('text')}</span>)}
          </div>
        </div>
      </div>

    );
  }

}
