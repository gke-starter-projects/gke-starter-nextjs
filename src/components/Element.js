import PropTypes from 'prop-types';
import React from 'react';

// Base Element component that renders a single element
const Element = ({ 
  as = 'span',
  children,
  className = '',
  ...props 
}) => {
  return React.createElement(
    as,
    {
      className,
      ...props
    },
    children
  );
};

Element.propTypes = {
  as: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  // Allow any other props
   
  [PropTypes.string]: PropTypes.any
};

Element.defaultProps = {
  as: 'span',
  children: null,
  className: ''
};

export default Element;
