/* eslint-disable react/no-set-state */
import React, { Component, PropTypes } from 'react';
import Infinite from 'react-infinite';

export default class InfiniteScroll extends Component {

  static propTypes = {
    children: PropTypes.node,
    containerHeight: PropTypes.number.isRequired,
    elementHeight: PropTypes.number.isRequired,
    loadMore: PropTypes.func.isRequired,
    // The distance between the bottom of the page and the current scroll location,
    // which triggers the loadMore function.
    offset: PropTypes.number.isRequired,
    // Optional current page.
    page: PropTypes.number
  };

  constructor (props) {
    super(props);
    this.loadMore = ::this.loadMore;
    this.state = { isLoading: false };
  }

  async loadMore () {
    const { page } = this.props;
    if (typeof page === 'number') {
      this.setState({ isLoading: true });
      await this.props.loadMore(page + 1);
      this.setState({ isLoading: false });
    }
  }

  render () {
    const { children, containerHeight, elementHeight, offset } = this.props;
    const { isLoading } = this.state;

    return (
      <Infinite
        containerHeight={containerHeight}
        elementHeight={elementHeight}
        infiniteLoadBeginEdgeOffset={containerHeight - offset}
        isInfiniteLoading={isLoading}
        onInfiniteLoad={this.loadMore}>
        {children}
      </Infinite>
      );
  }

}
