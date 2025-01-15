import PropTypes from 'prop-types';
import React from 'react';

// Base Element component that renders a single element
function Element({
  as = 'span',
  children,
  className = '',
  ...props
}) {
  return React.createElement(
    as,
    {
      className,
      ...props,
    },
    children,
  );
}

Element.propTypes = {
  as: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
};

Element.defaultProps = {
  as: 'span',
  children: null,
  className: '',
};

export default Element;
