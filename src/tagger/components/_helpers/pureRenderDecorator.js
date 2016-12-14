import shallowCompare from 'react-addons-shallow-compare';

/**
 * Makes the given component "pure".
 * @param object component Component.
 */
function pureRenderDecorator (component) {
  /**
   * Determines whether a component should update given it's next props and state.
   * @param object nextProps Next props.
   * @param object nextState Next state.
   */
  component.prototype.shouldComponentUpdate = function (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  };
}

export default pureRenderDecorator;
