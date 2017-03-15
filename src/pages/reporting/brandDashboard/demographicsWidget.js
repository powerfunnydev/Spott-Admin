import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { colors, fontWeights, makeTextStyle, mediaQueries } from '../../_common/styles';
import Spinner from '../../_common/components/spinner';
import ToolTip from '../../_common/components/toolTip';
import InfoSVG from '../../_common/images/info';
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
      borderBottom: `solid 1px ${colors.lightGray2}`,
      borderTop: `solid 1px ${colors.lightGray2}`,
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
    borderRight: {
      borderRight: `solid 1px ${colors.lightGray2}`
    },
    section: {
      base: {
        borderRight: `solid 1px ${colors.lightGray2}`,
        flex: 1,
        paddingBottom: '0.625em',
        paddingLeft: '0.625em',
        paddingRight: '0.625em',
        paddingTop: '0.625em',
        position: 'relative',
        textAlign: 'center',
        width: '100%'
      },
      blue: {
        backgroundColor: colors.lightBlue
      },
      gray: {
        backgroundColor: colors.lightGray4
      },
      green: {
        backgroundColor: colors.lightGreen2
      }
    },
    value: {
      base: {
        ...makeTextStyle(fontWeights.regular, '0.875em', 0.5),
        color: colors.black2
      },
      blue: {
        color: colors.primaryBlue
      },
      green: {
        color: colors.lightGreen
      }
    },
    label: {
      ...makeTextStyle(fontWeights.regular, '0.75em', 0.5),
      color: colors.lightGray3
    },
    tooltipOverlay: {
      padding: 11,
      backgroundColor: 'white',
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      maxWidth: 500
    },
    infoSvg: {
      position: 'absolute',
      top: 7,
      right: 7
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
          <div style={styles.right}>
            <div style={{ width: '100%' }}>
              <div style={[ styles.header, { borderTop: 'none' } ]}>Demographic insight</div>
              <div style={styles.sections}>
                {[
                  { label: 'Top Media', value: 'Familie' },
                  { label: 'Top Character', value: 'Jana' },
                  { label: 'Top Person', value: 'Penelope Cruz' }
                ].map(({ label, value }, i) => (
                  <div key={i} style={[ styles.section.base, i === 2 && { borderRight: 'none' }, value > 50 && styles.section.gray, value > 500 && styles.section.green, value > 1000 && styles.section.blue ]}>
                    <div style={styles.label}>{label}</div>
                    <div style={[ styles.value.base, { marginTop: 4 } ]}>{value}</div>
                    <ToolTip
                      arrowContent={<div className='rc-tooltip-arrow-inner' />}
                      overlay={<div style={styles.tooltipOverlay}>Test 123</div>}
                      placement='top'>
                      <div style={styles.infoSvg}><InfoSVG color={colors.lightGray3} hoverColor={colors.darkGray2}/></div>
                    </ToolTip>
                  </div>
                ))}
              </div>
            </div>
            <div style={styles.sections}>
              <div style={{ width: '100%' }}>
                <div style={[ styles.header, styles.borderRight ]}>Interaction with your brand</div>
                <div style={styles.sections}>
                  {[
                    { label: 'Brand Subscriptions', value: 154 },
                    { label: 'Product Impressions', value: 1556 },
                    { label: 'Product Clicktroughs', value: 862 },
                    { label: 'Product Buys', value: 23 }
                  ].map(({ label, value }, i) => (
                    <div key={i} style={[ styles.section.base, value > 50 && styles.section.gray, value > 500 && styles.section.green, value > 1000 && styles.section.blue ]}>
                      <div style={[ styles.value.base, value > 50 && styles.value.gray, value > 500 && styles.value.green, value > 1000 && styles.value.blue ]}>{value}</div>
                      <div style={[ styles.label, { marginTop: 4 } ]}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ width: '100%' }}>
                <div style={[ styles.header ]}>Insights</div>
                <div style={styles.sections}>
                  {[
                    { label: 'Brand Subscriptions', value: 154 },
                    { label: 'Product Impressions', value: 1556 },
                    { label: 'Ranking of 235 brands', value: 53 },
                    { label: 'Posible Reach', value: 1453 }
                  ].map(({ label, value }, i) => (
                    <div key={i} style={[ styles.section.base, i === 3 && { borderRight: 'none' }, value > 50 && styles.section.gray, value > 500 && styles.section.green, value > 1000 && styles.section.blue ]}>
                      <div style={[ styles.value.base, value > 50 && styles.value.gray, value > 500 && styles.value.green, value > 1000 && styles.value.blue ]}>{value}</div>
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
