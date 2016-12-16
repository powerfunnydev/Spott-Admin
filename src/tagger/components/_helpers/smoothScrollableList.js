import Radium from 'radium';
import React, { PropTypes } from 'react';
import ScrollableDiv from './scrollableDiv';
import { slowdown } from './utils';

/**
 * Internal helper value returning the value in the interval [min, max] that
 * is closest to val.
 */
function boundedBy (val, min, max) {
  return Math.max(min, Math.min(val, max));
}

/**
 * A high-performant container for scrollable lists, using a sliding window
 * technique to only render the DOM elements currently visisble.
 * DOM elements before the current window are not rendered, instead a
 * DIV with a carefully determined height exactly matching the original DOM elements
 * is rendered. The same technique is used for DOM elements after the current window.
 * As such, the total height does never change, and scrollbars continue to work.
 *
 * TODO/ use the state tree (props) instead of component state
 */
@Radium
export default class SmoothScrollableList extends React.Component {

  // TODO: this can be more precise, and documented
  static propTypes = {
    innerStyle: PropTypes.any,
    numberOfRecords: PropTypes.any,
    recordHeight: PropTypes.any,
    recordsPerRow: PropTypes.any,
    renderRecord: PropTypes.any,
    style: PropTypes.any
  };

  constructor (props) {
    super(props);
    // Bind handlers
    this.onScroll = slowdown(this.onScroll, 100).bind(this);
    // Set initial state
    this.state = {
      displayStart: 0,
      displayEnd: 0
    };
  }

  componentDidMount () {
    // Calculate the display window for the initial scroll top 0.
    const { numberOfRecords, recordHeight, recordsPerRow } = this.props;
    this._setDisplayWindowState(numberOfRecords, recordHeight, recordsPerRow);
  }

  componentWillReceiveProps (nextProps) {
    // Calculate the display window for the new props at the current scroll top.
    const { numberOfRecords, recordHeight, recordsPerRow } = nextProps;
    this._setDisplayWindowState(numberOfRecords, recordHeight, recordsPerRow);
  }

  /**
   * Helper method, which takes the current scrollTop and, as well as numberOfRecords, recordHeight, recordsPerRow.
   * the component's own props). It updates displayStart and displayEnd on state if absolutely necessary.
   */
  _setDisplayWindowState (numberOfRecords, recordHeight, recordsPerRow) {
    // Get stuff from DOM (client height, scroll top)
    const scrollTop = (this.scrollable && this.scrollable.getScrollTop()) || 0;
    const clientHeight = (this.scrollable && this.scrollable.getClientHeight()) || 0;
    // Determine recordsPerBody using the available information of items (numberOfRecords, recordHeight, recordsPerRow)
    // and client window (clientHeight)
    const numRowsPerBody = Math.max(1, Math.ceil(clientHeight / recordHeight));
    const recordsPerBody = numRowsPerBody * recordsPerRow;
    const recordsPerWindow = recordsPerBody * 2;
    // Calculations of visibleXxxx
    const visibleStart = Math.floor(scrollTop / recordHeight) * recordsPerRow;
    const visibleEnd = visibleStart + recordsPerBody;
    // Calculate new displayStart/displayEnd and update my state in case we've reached a threshold
    if (this.state.displayEnd >= numberOfRecords ||
        visibleStart <= this.state.displayStart + recordsPerWindow ||
        visibleEnd >= this.state.displayEnd - recordsPerWindow) {
      // Update the state. We use helper function boundedBy() to avoid incorrect indices at any moment.
      this.setState({ // eslint-disable-line
        displayStart: boundedBy(visibleStart - recordsPerWindow, 0, numberOfRecords),
        displayEnd: boundedBy(visibleEnd + recordsPerWindow, 0, numberOfRecords)
      });
    }
  }

  onScroll () {
    // Recalculate the display window for the current scroll position
    const { numberOfRecords, recordHeight, recordsPerRow } = this.props;
    this._setDisplayWindowState(numberOfRecords, recordHeight, recordsPerRow);
  }

  render () {
    const { innerStyle, numberOfRecords, recordHeight, recordsPerRow, renderRecord, style } = this.props;
    // Get floating display window size
    const { displayStart, displayEnd } = this.state;
    // Create an array data structure for collecting references to our children
    const childComponents = [];
    // Push the first row: this row is a dummy row with a carefully determined height
    const firstRowHeight = recordHeight * (displayStart / recordsPerRow) || 0;
    childComponents.push(<div key='firstRow' style={{ height: firstRowHeight, width: '100%' }} />);
    // Push items
    for (let i = displayStart; i < displayEnd; i++) {
      childComponents.push(renderRecord(i));
    }
    // Create last row: this row is once again a dummy row with a carefully determined height
    const lastRowHeight = recordHeight * ((numberOfRecords - displayEnd) / recordsPerRow) || 0;
    childComponents.push(<div key='lastRow' style={{ height: lastRowHeight, width: '100%' }} />);
    // Render it!
    return (
      <ScrollableDiv ref={(scrollable) => { this.scrollable = scrollable; }} style={[ style ]} onScroll={this.onScroll}>
        <ul style={innerStyle}>
          {childComponents}
        </ul>
      </ScrollableDiv>
    );
  }

}
