import React, { Component, PropTypes } from 'react';
import { colors, fontWeights, makeTextStyle } from '../../../../../../../pages/_common/styles';
import Plus from '../../../../../../../pages/_common/images/plus';

export default class CreateCollectionItem extends Component {

  static propTypes = {
    onCollectionItemCreate: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props);
    this.onClickAdd = ::this.onClickAdd;
  }

  onClickAdd (e) {
    e.preventDefault();
    this.props.onCollectionItemCreate();
  }

  static styles = {
    add: {
      marginTop: '0.625em'
    },
    container: {
      ...makeTextStyle(fontWeights.regular, '0.75em'),
      alignItems: 'center',
      border: `dashed 1px ${colors.lightGray2}`,
      borderRadius: '0.125em',
      color: colors.lightGray3,
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      height: 80,
      justifyContent: 'center',
      textAlign: 'center',
      width: 80
    }
  }

  render () {
    const styles = this.constructor.styles;
    return (
      <div style={styles.container} onClick={this.onClickAdd}>
        <Plus color={colors.lightGray3}/>
        <span style={styles.add}>Add</span>
      </div>
    );
  }
}
