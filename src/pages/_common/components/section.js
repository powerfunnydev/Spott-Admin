import Radium from 'radium';
import React, { Component, PropTypes } from 'react';
import { colors } from '../styles';
import { ErrorComponent, HintComponent, InfoComponent } from './infoPopUps';

const defaultSpacing = 15;
@Radium
export default class Section extends Component {

  static propTypes = {
    children: PropTypes.node,
    clearPopUpMessage: PropTypes.func,
    first: PropTypes.bool,
    noPadding: PropTypes.bool,
    popUpObject: PropTypes.object,
    style: PropTypes.object,
    title: PropTypes.node
  };

  static styles = {
    container: {
      borderColor: colors.lightGray3,
      borderStyle: 'solid',
      borderWidth: 1,
      backgroundColor: colors.white,
      borderTopRightRadius: '2px',
      color: colors.black,
      marginTop: '-1px'
    },
    first: {
      marginTop: 0
    },
    title: {
      fontSize: '26px',
      marginBottom: defaultSpacing * 2
    },
    padding: {
      padding: '30px 22.5px'
    }
  }

  render () {
    const { styles } = this.constructor;
    const { children, first, style, title, popUpObject, clearPopUpMessage, noPadding } = this.props;
    // Determine items
    return (
      <div style={[ styles.container, style ]}>
        {popUpObject && popUpObject.type === 'error' && popUpObject.message && popUpObject.stackTrace &&
          <ErrorComponent message={popUpObject.message} stackTrace={popUpObject.stackTrace} onClose={clearPopUpMessage}/>
        }
        {popUpObject && popUpObject.type === 'hint' && popUpObject.message &&
          <HintComponent message={popUpObject.message} onClose={clearPopUpMessage}/>
        }
        {popUpObject && popUpObject.type === 'info' && popUpObject.message &&
          <InfoComponent message={popUpObject.message} onClose={clearPopUpMessage}/>
        }
        <div style={[ !noPadding && styles.padding, first && styles.first ]}>
          {title && <h2 style={styles.title}>{title}</h2>}
          {children}
        </div>
      </div>
    );
  }
}
