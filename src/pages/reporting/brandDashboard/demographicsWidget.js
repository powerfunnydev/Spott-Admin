import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { colors, fontWeights, makeTextStyle, mediaQueries } from '../../_common/styles';
import Spinner from '../../_common/components/spinner';
import Widget from './widget';

@Radium
export default class DemographicsWidget extends Component {

  static propTypes = {
    children: PropTypes.node,
    style: PropTypes.object,
    title: PropTypes.string
  };

  static styles = {
    container: {
      border: `solid 1px ${colors.lightGray2}`,
      display: 'flex'
    },
    audience: {
      ...makeTextStyle(fontWeights.regular, '0.813em', 0.2),
      color: colors.darkGray3,
      marginTop: '3em'
    },
    audienceCount: {
      ...makeTextStyle(fontWeights.regular, '0.875em', 0.5),
      color: colors.black2,
      marginTop: 14
    },
    audienceLabel: {
      ...makeTextStyle(fontWeights.regular, '0.75em', 0.5),
      color: colors.lightGray3
    },
    left: {
      backgroundColor: colors.lightGray4,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      textAlign: 'center',
      width: 235,
      padding: 19,
      borderRight: `solid 1px ${colors.lightGray2}`
    },
    right: {
      width: '100%'
    },
    header: {
      ...makeTextStyle(fontWeights.regular, '0.688em', 0.5),
      alignItems: 'center',
      backgroundColor: colors.veryLightGray,
      border: `solid 1px ${colors.lightGray2}`,
      color: colors.darkGray2,
      display: 'flex',
      textTransform: 'uppercase',
      width: '100%',
      height: 33,
      paddingLeft: 24
    },
    sections: {
      display: 'flex',
      width: '100%'
    },
    section: {
      paddingLeft: '0.625em',
      paddingRight: '0.625em',
      paddingTop: '0.625em',
      paddingBottom: '0.625em',
      textAlign: 'center',
      flex: 1,
      width: '100%',
      borderRight: `solid 1px ${colors.lightGray2}`
    },
    value: {
      ...makeTextStyle(fontWeights.regular, '0.875em', 0.5),
      color: colors.black2
    },
    label: {
      ...makeTextStyle(fontWeights.regular, '0.75em', 0.5),
      color: colors.lightGray3
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { style, title } = this.props;
    return (
      <Widget style={style} title={title}>
        <div style={styles.container}>
          <div style={styles.left}>
            <div style={styles.audience}>0 to 18 Years, Dutch, Male</div>
            <div style={styles.audienceCount}>1868</div>
            <div style={styles.audienceLabel}>Users in this demographic</div>
          </div>
          <div style={[ styles.right, { marginLeft: -1, marginRight: -1 } ]}>
            <div style={{ width: '100%' }}>
              <div style={[ styles.header, { marginTop: -1 } ]}>Demographic insight</div>
              <div style={styles.sections}>
                {[
                  { label: 'Top Media', value: 'Familie' },
                  { label: 'Top Character', value: 'Jana' },
                  { label: 'Top Person', value: 'Penelope Cruz' }
                ].map(({ label, value }, i) => (
                  <div key={i} style={styles.section}>
                    <div style={styles.label}>{label}</div>
                    <div style={[ styles.value, { marginTop: 4 } ]}>{value}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={styles.sections}>
              <div style={{ width: '100%' }}>
                <div style={styles.header}>Interaction with your brand</div>
                <div style={styles.sections}>
                  {[
                    { label: 'Brand Subscriptions', value: 154 },
                    { label: 'Product Impressions', value: 1556 },
                    { label: 'Product Clicktroughs', value: 862 },
                    { label: 'Product Buys', value: 23 }
                  ].map(({ label, value }, i) => (
                    <div key={i} style={styles.section}>
                      <div style={styles.value}>{value}</div>
                      <div style={[ styles.label, { marginTop: 4 } ]}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ width: '100%' }}>
                <div style={[ styles.header, { marginLeft: -1 } ]}>Insights</div>
                <div style={styles.sections}>
                  {[
                    { label: 'Brand Subscriptions', value: 154 },
                    { label: 'Product Impressions', value: 1556 },
                    { label: 'Product Clicktroughs', value: 862 },
                    { label: 'Product Buys', value: 23 }
                  ].map(({ label, value }, i) => (
                    <div key={i} style={styles.section}>
                      <div style={styles.value}>{value}</div>
                      <div style={[ styles.label, { marginTop: 4 } ]}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Widget>
    );
  }
}
