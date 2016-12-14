import Radium from 'radium';

const itemBackgroundPulse = Radium.keyframes({
  '0%': { backgroundColor: 'rgb(60, 60, 60)' },
  '70%': { backgroundColor: 'rgb(80, 80, 80)' },
  '100%': { backgroundColor: 'rgb(60, 60, 60)' }
}, 'itemBackgroundPulse');

const itemStyles = {
  wrapper: {
    base: {
      alignItems: 'stretch',
      backgroundColor: 'rgb(43, 43, 43)',
      borderRadius: '2px',
      color: 'rgb(130, 130, 130)',
      display: 'flex',
      height: 32,
      lineHeight: '32px',
      marginBottom: 3
    },
    hovered: {
      animation: 'x 0.7s infinite',
      animationName: itemBackgroundPulse
    },
    selected: {
      // Override hovered animation
      animation: 'none',
      // Set colors
      color: 'rgb(255, 255, 255)',
      backgroundColor: 'rgb(150, 150, 150)'
    }
  },
  image: {
    cursor: 'pointer',
    // Positioning
    flex: '0 0 32px',
    height: 32,
    width: 32,
    // Background properties. The background-image gets injected in JavaScript.
    backgroundColor: 'transparent',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain'
  },
  text: {
    flex: '1',
    // Basic layout
    fontFamily: 'Rubik-Medium',
    fontSize: '14px',
    // Keep some space from the images to the left and right
    paddingLeft: 9,
    paddingRight: 9,
    // Prevent long item names to overflow by wrapping to the next line
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    // Show a hand cursor instead of a text cursor
    cursor: 'pointer'
  },
  textRegular: {
    fontFamily: 'Rubik-Regular'
  },
  threeLines: {
    // Positioning
    flex: '0 0 32px',
    height: 32,
    width: 32,
    // Use an up/down arrow
    cursor: 'ns-resize'
  }
};

/**
 * Component decorator for setting the styles common to all sidebar list items
 * (characters and products)
 */
export default function ItemStyleDecorator (component) {
  component.styles = itemStyles;
}
