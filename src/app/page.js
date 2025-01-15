import * as React from 'react';
import Container from '@mui/material/Container';
import content from './input.json';
import RecursiveElement from '../components/RecursiveElement';

function preprocessContent(fullData) {
  // Create a new function that maintains its own counter stack
  function processContentWithStack(data) {
    const counterStack = []; // Stack to keep track of counters at each level

    function processNode(node, depth = 0) {
      // Initialize counter at this depth if it doesn't already exist
      if (counterStack.length <= depth) {
        counterStack[depth] = 0;
      }

      if (node.type === 'clause') {
        counterStack[depth] += 1;

        // Create the counter string from the current stack state
        const currentCounter = counterStack.slice(0, depth + 1).join('.');

        // Add the counter to the node's children if appropriate
        if (node.children?.[0]?.children) {
          if (!node.children[0].children[0]?.alreadyCounted) {
            node.children[0].children.unshift({
              text: `${currentCounter}. `,
            });
          }
        }

        // Process all children at the next depth level
        if (node.children) {
          node.children.forEach((child) => {
            processNode(child, depth + 1);
          });
        }

        // Important: Reset the counter stack for all deeper levels
        // AFTER processing children
        counterStack.length = depth + 1;
      } else if (node.children) {
        node.children.forEach((child) => {
          processNode(child, depth);
        });
      }
    }

    // Process each top-level node
    data.forEach((node) => processNode(node));

    return data;
  }

  // Create a deep copy of the data to avoid modifying the original
  const dataCopy = JSON.parse(JSON.stringify(fullData));
  return processContentWithStack(dataCopy);
}

// Example usage in React component
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
