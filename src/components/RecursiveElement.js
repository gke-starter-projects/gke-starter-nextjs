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
    const textContent = node?.text || node;
    const textStyle = {};

    if (node?.bold) {
      textStyle.fontWeight = 'bold';
    }
    if (node?.underline) {
      textStyle.textDecoration = 'underline';
    }

    // Split text by newlines and render with breaks
    return (
      <span style={textStyle}>
        {textContent.split('\n').map((line, index, array) => (
          <React.Fragment key={Math.random()}>
            {line}
            {index < array.length - 1 && <br />}
          </React.Fragment>
        ))}
      </span>
    );
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

  // Determine if the element needs to be bold or underlined
  const style = {};
  if (otherProps.bold === true) {
    style.fontWeight = 'bold';
  } else {
    style.fontWeight = 'normal';
  }
  if (otherProps.underline === true) {
    style.textDecoration = 'underline';
  }

  // Use React.Fragment if type resolves to undefined
  const elementType = type ? get(specialElementLut, type, type) : React.Fragment;

  // Render children recursively
  const renderedChildren = Array.isArray(children)
    ? children.map((child) => (
      <RecursiveElement key={child.title} node={child} />
    ))
    : children;

  return (
    <Element
      as={elementType}
      style={style}
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
