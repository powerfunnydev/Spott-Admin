/* eslint-disable no-return-assign */
/* eslint-disable react/no-set-state */
import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ProductGroupEditForm from './productGroupEditForm';

const deleteIcon = require('../images/delete.svg');
const editIcon = require('../images/edit.svg');

export default class SectionTitle extends Component {

  static propTypes = {
    editing: PropTypes.bool.isRequired,
    productGroup: ImmutablePropTypes.map.isRequired,
    onClickEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props);
    this.onMouseEnter = ::this.onMouseEnter;
    this.onMouseLeave = ::this.onMouseLeave;
    this.onClickEdit = ::this.onClickEdit;
    this.onDelete = ::this.onDelete;
    this.state = { hover: false };
  }

  onClickEdit (e) {
    e.stopPropagation();
    this.props.onClickEdit();
  }

  onDelete (e) {
    e.stopPropagation();
    this.props.onDelete();
  }

  onMouseEnter (e) {
    e.preventDefault();
    this.setState({ hover: true });
  }

  onMouseLeave (e) {
    e.preventDefault();
    this.setState({ hover: false });
  }

  static styles = {
    editButton: {
      marginLeft: 10,
      marginRight: 10
    },
    container: {
      display: 'flex'
    },
    text: {
      maxWidth: 270,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { editing, productGroup, onEdit } = this.props;
    const { hover } = this.state;

    if (editing) {
      return (
        <ProductGroupEditForm
          currentProductGroup={productGroup}
          form='editProductGroup'
          onSubmit={onEdit} />
      );
    }

    return (
      <span style={styles.container} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
        <div style={styles.text}>{productGroup.get('name') || 'Untitled'}</div>
        {hover && <button style={styles.editButton} title='Edit set' onClick={this.onClickEdit}>
          <img alt='Edit set' src={editIcon} title='Edit set' />
        </button>}
        {hover && <button title='Remove set' onClick={this.onDelete}>
          <img alt='Remove set' src={deleteIcon} title='Remove set' />
        </button>}
      </span>
    );
  }
}
