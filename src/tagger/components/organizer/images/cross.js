/* eslint-disable react/prop-types */
import React from 'react';

export default ({ color = '#fff' }) => {
  return <svg height='14' style={{ display: 'block' }} viewBox='0 0 14 14' width='14' xmlns='http://www.w3.org/2000/svg'><g fill='none' fillRule='evenodd'><path d='M-5-5h24v24H-5z'/><path d='M7 5.586L2.05.636.636 2.05 5.586 7l-4.95 4.95 1.414 1.414L7 8.414l4.95 4.95 1.414-1.414L8.414 7l4.95-4.95L11.95.636 7 5.586z' fill={color}/></g></svg>;
};
