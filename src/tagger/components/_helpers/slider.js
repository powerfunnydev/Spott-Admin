import nouislider from 'nouislider';
import React, { Component, PropTypes } from 'react';

require('./slider.css');

/**
 * Wrapper around the rather minimal nouislider library, which can be found at
 * https://github.com/leongersen/noUiSlider.
 */
export default class Slider extends Component {

  static propTypes = {
    // The maximum numeric value which can be selected by use of the slider
    max: PropTypes.number.isRequired,
    // The minimal numeric value which can be selected by use of the slider
    min: PropTypes.number.isRequired,
    // CSS styles to be attached to this component's root DOM node
    style: PropTypes.object,
    // The currently selected numeric value in the slider
    value: PropTypes.number.isRequired,
    // Callback function to be invoked whenever a new value is selected by using the slider.
    onChange: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.createSlider = ::this.createSlider;
  }

  componentDidMount () {
    this.createSlider();
  }

  componentDidUpdate () {
    // Recreate the slider. Note that updates also occur whenever we receive a new value
    // for the "value" property, i.e. we recreate the scrollbar.
    this.slider.destroy();
    this.createSlider();
  }

  componentWillUnmount () {
    this.slider.destroy();
  }

  createSlider () {
    // Create a new nouislider instance. Pass any configuration passed via props
    // to this component.
    const slider = this.slider = nouislider.create(this.sliderContainer, {
      behaviour: 'tap',
      range: {
        min: this.props.min,
        max: this.props.max
      },
      step: 1,
      start: this.props.value
    });
    // Install hook for the slide event. This event is triggered when the slider is moved by tapping it
    // as well as when a handle moves while dragging.
    slider.on('slide', (values) => {
      // Immediatly undo the change, we have to receive new props before
      // we save the new value.
      this.slider.set(this.props.value);
      // Fire the on change event
      this.props.onChange(parseInt(values[0], 10));
    });
  }

  render () {
    return <div ref={(slider) => { this.sliderContainer = slider; }} style={this.props.style} />;
  }
}
