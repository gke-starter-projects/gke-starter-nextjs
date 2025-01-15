import * as React from 'react';
import Container from '@mui/material/Container';
import content from './input.json';
import RecursiveElement from '../components/RecursiveElement';

function preprocessContent(data) {
  let counterStack = []; // Stack to keep track of counters at each level

  function processNode(node, depth = 0) {
    // Initialize counter at this depth if it doesn't already exist
    if (counterStack.length <= depth) {
      counterStack[depth] = 0; // Start counting from zero
    }

    // Check if the current node is of type 'clause' and increment counter for this depth
    if (node.type === 'clause') {
      counterStack[depth] += 1; // Increment the current depth counter
      const currentCounter = counterStack.slice(0, depth + 1).join('.');

      // Ensure there is at least one child and the first child has a 'children' array
      if (node.children && node.children.length > 0 && node.children[0].children) {
        if (!node.children[0].children[0].alreadyCounted) {
          node.children[0].children.unshift({
            alreadyCounted: true,
            text: `${currentCounter}. `,
          });
        }
      }
    }

    // Recursively process children if they exist
    if (node.children && node.children.length > 0) {
      node.children.forEach((child) => processNode(child, depth + 1));
    }

    // Reset counters for sublevels when leaving a nesting level
    if (depth < counterStack.length - 1) {
      counterStack = counterStack.slice(0, depth + 1);
    }
  }

  // Process each top-level node in the JSON array
  data.forEach((node) => processNode(node));
  return data;
}

export default function Home() {
  const processedContent = preprocessContent(content);
  return (
    <Container maxWidth="lg">
      {processedContent.map((node) => (
        <RecursiveElement key={node.title} node={node} />
      ))}
    </Container>
  );
}
