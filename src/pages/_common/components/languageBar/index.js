import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { Field } from 'redux-form/immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import Button from '../../components/buttons/button';
import RemoveButton from '../../components/buttons/removeButton';
import { buttonStyles, makeTextStyle, fontWeights } from '../../styles';
import SelectionDropdown from '../selectionDropdown';

import selector from './selector';

@connect(selector)
@Radium
export default class LanguageBar extends Component {

  static propTypes = {
    _activeLocale: PropTypes.string,
    currentModal: PropTypes.string,
    defaultLocale: PropTypes.string,
    errors: PropTypes.object,
    localeNames: ImmutablePropTypes.map.isRequired,
    openCreateLanguageModal: PropTypes.func.isRequired,
    removeLanguage: PropTypes.func.isRequired,
    supportedLocales: ImmutablePropTypes.list,
    onSetDefaultLocale: PropTypes.func.isRequired
  };

  static styles = {
    topBar: {
      display: 'flex',
      flexDirection: 'row',
      paddingTop: '20px',
      paddingBottom: '20px',
      paddingLeft: '22.5px',
      paddingRight: '22.5px'
    },
    baseLanguageButton: {
      paddingTop: '3px',
      paddingBottom: '3px',
      ...makeTextStyle(fontWeights.regular, '11px')
    },
    removeLanguageButton: {
      width: '20px',
      height: '21px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: '2px'
    },
    removeLanguageButtonPadding: {
      paddingLeft: '10px'
    }
  }

  render () {
    const { styles } = this.constructor;
    const { _activeLocale, errors, localeNames, defaultLocale, removeLanguage, supportedLocales,
      onSetDefaultLocale, openCreateLanguageModal } = this.props;
    return (
      <div style={[ styles.topBar ]}>
        <Field
          component={SelectionDropdown}
          createOption= {
            // localesNames is a immutable map. e.g. { en: 'English', fr: 'French' }
            // This map contains all languages that can be added to te list of languages.
            // supportedLocales is an immutable array. e.g. [ 'en', 'fr ']
            // This array contains all supproted languages for this media.
            // If the length of array of keys of the map is the same as the length
            // of the supported languages, it is useless to show the 'Add language' button
            localeNames && supportedLocales &&
            localeNames.keySeq().toArray().length !== supportedLocales.toArray().length &&
            openCreateLanguageModal || undefined}
          createOptionText= 'Add language'
          disabled={typeof errors !== 'undefined'}
          getItemText={(language) => {
            const locale = localeNames.get(language);
            return defaultLocale === language ? `${locale} (Base)` : locale;
          }}
          name='_activeLocale'
          options={supportedLocales && supportedLocales.toArray() || []}
          placeholder='Language'/>
        {_activeLocale !== defaultLocale &&
          <Button
            style={[ buttonStyles.white, styles.baseLanguageButton ]}
            text='Set as base language'
            onClick={onSetDefaultLocale}/>
          }
        {_activeLocale !== defaultLocale &&
          <div style={styles.removeLanguageButtonPadding}>
            <RemoveButton
              noCofirmation
              style={[ buttonStyles.white, styles.removeLanguageButton ]}
              onClick={removeLanguage}/>
          </div>
          }
      </div>
    );
  }
}
