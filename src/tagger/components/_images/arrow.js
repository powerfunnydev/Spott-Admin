/* eslint-disable react/prop-types */
import React from 'react';

export default ({ color = '#fff', position = 'DOWN' }) => {
  const style = {
    display: 'block',
    transition: 'transform 0.25s ease-in'
  };
  if (position === 'UP') {
    style.transform = 'scale(1, -1)';
    style.transition = 'transform 0.25s ease-out';
  }
  return <svg height='5' style={style} viewBox='0 0 9 5' width='9' xmlns='http://www.w3.org/2000/svg'><g fill='none' fillRule='evenodd'><path d='M-8-10h24v24H-8z'/><path d='M0 0l4.5 5L9 0z' fill={color} /></g></svg>;
};
