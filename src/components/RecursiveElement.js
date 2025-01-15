import PropTypes from 'prop-types';
import React from 'react';
import get from 'lodash/get';
import Element from './Element';
import Badge from './Badge';

function RecursiveElement({ node }) {
  // If node is null or undefined
  if (!node) {
    return null;
  }

  // If node is a text node (leaf node)
  if (typeof node === 'string' || node?.text) {
    return node?.text || node;
  }

  // Process styles and extract remaining props
  const { children, type, ...otherProps } = node;

  const specialElementLut = {
    p: 'div', // Better for SEO allegedly
    block: 'div',
    clause: 'span',
    lic: 'span',
    mention: Badge,
  };

  // Use React.Fragment if type resolves to undefined
  const elementType = type ? get(specialElementLut, type, type) : React.Fragment;

  // Render children recursively
  const renderedChildren = Array.isArray(children)
    ? children.map((child) => (
      <RecursiveElement key={child.title} node={child} />
    ))
    : children;

  // Return the Element with recursively rendered children
  return (
    <Element
      as={elementType}
      {...otherProps}
    >
      {renderedChildren}
    </Element>
  );
}

RecursiveElement.propTypes = {
  node: PropTypes.node.isRequired,
};

export default RecursiveElement;
