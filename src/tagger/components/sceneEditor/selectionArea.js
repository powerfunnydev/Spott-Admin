/* eslint-disable react/no-set-state */
/* eslint-disable no-return-assign */
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

export default class SelectionArea extends Component {

  static propTypes = {
    children: PropTypes.node.isRequired,
    disable: PropTypes.bool.isRequired,
    style: PropTypes.object.isRequired,
    // Event that will be fired when a selection was made.
    // Passed { height, width, x, y } of selection.
    onSelection: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);

    // The state holds the information to draw the rectangle (current selection).
    this.mouseDownData = null;
    this.state = {
      isSelecting: false,
      width: 0,
      height: 0,
      x: 0,
      y: 0
    };

    this.onMouseDown = ::this.onMouseDown;
    this.onMouseMove = ::this.onMouseMove;
    this.onMouseUp = ::this.onMouseUp;
    this.setInitialState = ::this.setInitialState;
  }

  /**
   * When the component is mounted in the DOM, add a mousedown event listener.
   */
  componentDidMount () {
    this.node = ReactDOM.findDOMNode(this);
    this.node.addEventListener('mousedown', this.onMouseDown);
  }

	/**
	 * When the component is unmounted from the DOM, remove the mousedown event listener.
	 */
  componentWillUnmount () {
    this.node.removeEventListener('mousedown', this.onMouseDown);
  }

  setInitialState () {
    this.setState({
      isSelecting: false,
      width: 0,
      height: 0,
      x: 0,
      y: 0
    });
  }

	/**
	 * Called while moving the mouse with the button down. Changes the boundaries
	 * of the selection box
	 */
  onMouseMove (e) {
    // The initial x, y coordinates, on mouse down.
    const { x, y } = this.mouseDownData;
    const width = Math.abs(x - e.pageX);
    const height = Math.abs(y - e.pageY);

    this.setState({
      isSelecting: true,
      width,
      height,
      x: Math.min(e.pageX, x),
      y: Math.min(e.pageY, y)
    });
  }

	/**
	 * Called when a user presses the mouse button. Determines if a select box should
	 * be added, and if so, attach event listeners
	 */
  onMouseDown (e) {
    this.mouseDownData = null;

    if (!this.props.disable) {
      e.preventDefault();

      this.node.addEventListener('mouseup', this.onMouseUp);

      // Ignore right clicks.
      if (e.which === 3 || e.button === 2) {
        return;
      }

      this.mouseDownData = {
        x: e.pageX,
        y: e.pageY
      };

      this.setState({
        isSelecting: true,
        width: 0,
        height: 0,
        x: e.pageX,
        y: e.pageY
      });

      this.node.addEventListener('mousemove', this.onMouseMove);
    }
  }

	/**
	 * Called when the user has completed selection
	 */
  onMouseUp (e) {
    this.node.removeEventListener('mousemove', this.onMouseMove);
    this.node.removeEventListener('mouseup', this.onMouseUp);

    // Skip when there was no mouse down data.
    if (!this.mouseDownData) {
      return;
    }

    const { height, width, x, y } = this.state;
    this.props.onSelection({ height, width, x, y });
    this.setInitialState();
  }

	/**
	 * Renders the component
	 * @return {ReactComponent}
	 */
  render () {
    const { style } = this.props;
    const { height, isSelecting, width, x, y } = this.state;

    const boxStyle = {
      cursor: 'default',
      height,
      left: x,
      position: 'fixed',
      top: y,
      width,
      zIndex: 9000
    };

    const spanStyle = {
      backgroundColor: 'transparent',
      border: '1px dashed #999',
      width: '100%',
      height: '100%',
      float: 'left'
    };

    return (
			<div ref={(c) => this.component = c} style={style}>
				{isSelecting &&
          <div style={boxStyle}>
            <span style={spanStyle} />
          </div>}
				{this.props.children}
			</div>
		);
  }
}
