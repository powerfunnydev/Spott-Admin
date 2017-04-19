import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import Radium from 'radium';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { confirmation } from '../../../pages/_common/askConfirmation';

import colors from '../colors';

@Radium
export default class Crop extends Component {

  static propTypes = {
    crop: ImmutablePropTypes.map.isRequired,
    onDelete: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onDeleteClick = ::this.onDeleteClick;
    this.onEditClick = ::this.onEditClick;
  }

  async onDeleteClick (e) {
    e.preventDefault();
    const result = await confirmation();
    if (result) {
      this.props.onDelete(this.props.crop.get('id'));
    }
  }

  onEditClick (e) {
    e.preventDefault();
    this.props.onEdit(this.props.crop.get('id'));
  }

  static styles = {
    wrapper: {
      padding: '0.438em',
      width: '14em'
    },
    container: {
      backgroundColor: colors.black1,
      borderRadius: 2,
      overflow: 'hidden'
    },
    content: {
      padding: '1em'
    },
    image: {
      display: 'inherit',
      overflow: 'hidden',
      width: '100%'
    },
    comment: {
      color: colors.warmGray,
      fontSize: '0.75em'
    },
    title: {
      color: 'white',
      fontSize: '0.875em'
    },
    topic: {
      color: 'white',
      fontSize: '0.75em',
      fontWeight: 500,
      textDecoration: 'underline',
      marginRight: '0.5em'
    },
    button: {
      base: {
        borderRadius: 2,
        color: 'white',
        fontSize: '0.75em',
        marginTop: '0.875em',
        padding: '0.25em',
        textAlign: 'center',
        width: '100%'
      },
      edit: {
        backgroundColor: colors.strongBlue,
        ':hover': {
          backgroundColor: '#08a7d7'
        },
        ':focus': {
          backgroundColor: '#0795c0'
        }
      },
      remove: {
        backgroundColor: '#d31751',
        ':hover': {
          backgroundColor: '#f31751'
        },
        ':focus': {
          backgroundColor: '#ed316b'
        }
      }
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { crop } = this.props;

    return (
      <div style={styles.wrapper}>
        <div style={styles.container}>
          <img src={crop.getIn([ 'image', 'url' ])} style={styles.image}/>
          <div style={styles.content}>
            <h2 style={styles.title}>{crop.get('title')}</h2>
            {crop.get('comment') &&
              <div style={styles.comment}>{crop.get('comment')}</div>}
            {crop.get('topics').map((topic) => <span key={topic.get('id')} style={styles.topic}>{topic.get('text')}</span>)}
            <button key='edit' style={[ styles.button.base, styles.button.edit ]} onClick={this.onEditClick}>
              Edit
            </button>
            <button key='delete' style={[ styles.button.base, styles.button.remove ]} onClick={this.onDeleteClick}>
              Remove
            </button>
          </div>
        </div>
      </div>

    );
  }

}
