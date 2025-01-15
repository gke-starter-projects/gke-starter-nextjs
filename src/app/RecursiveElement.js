import PropTypes from 'prop-types';
import React from 'react';
import get from 'lodash/get';
import Badge from './Badge';
import Element from './Element';

// Process styles and combine with other props
const processStyles = (node) => {
  const { color, style, ...rest } = node;

  const styles = {
    ...(style || {}),
    ...(color ? { color } : {}),
  };

  return {
    ...(Object.keys(styles).length > 0 ? { style: styles } : {}),
    ...rest,
  };
};

function RecursiveElement({ node }) {
  // If node is a text node (leaf node) with color, render as badge
  if (node?.text && node?.color) {
    return <Badge color={node.color}>{node.text}</Badge>;
  }

  // If node is a text node (leaf node)
  if (typeof node === 'string' || node?.text) {
    return node?.text || node;
  }

  // If node is null or undefined
  if (!node) {
    return null;
  }

  // Process styles and extract remaining props
  const { children, type, ...otherProps } = processStyles(node);

  const specialElementLut = {
    block: 'div',
    clause: 'span',
    lic: 'span',
    mention: 'span',
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
