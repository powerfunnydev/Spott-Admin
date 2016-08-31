import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { currentLocaleSelector } from '../../selectors/global';
import counterpart from 'counterpart';
import lang from '../../lang/index';
import reactStringReplace from 'react-string-replace';

// Register counterpart locales
Object.keys(lang.localeData).forEach((locale) => {
  const localeData = lang.localeData[locale];
  counterpart.registerTranslations(locale, {
    counterpart: { pluralize: require('pluralizers/en') },
    ...localeData
  });
});

/**
  * Decorator which adds props 'getLocalizedResource' and 't' (both functions).
  * Each time the language changes the component will be rerendered.
  * The function 't', translates a given key to the current language.
  */
export default function localized (WrappedComponent) {
  return (
    @connect(createStructuredSelector({ currentLocale: currentLocaleSelector }))
    class Translated extends Component {

      static propTypes = {
        currentLocale: PropTypes.string.isRequired
      };

      constructor (props, context) {
        super(props, context);
        this._getLocalizedResource = ::this._getLocalizedResource;
        this._t = ::this._t;
      }

      _getLocalizedResource (resource) {
        return lang.localizedResources[resource][this.props.currentLocale];
      }

      _t (key, interpolationValues = {}, injectElFunction = null) {
        // If key is a string we want a normal internal translation
        const localizedString = counterpart(key, { locale: this.props.currentLocale, ...(interpolationValues || {}) });
        if (injectElFunction) {
          return reactStringReplace(localizedString, /\[\[(.*?)\]\]/g, (match, i) => injectElFunction(match, i));
        }
        return localizedString;
      }

      render () {
        return <WrappedComponent {...this.props} getLocalizedResource={this._getLocalizedResource} t={this._t} />;
      }
    }
  );
}
