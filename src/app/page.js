import * as React from 'react';
import Container from '@mui/material/Container';
import content from './input.json';
import RecursiveElement from './RecursiveElement';

export default function Home() {
  return (
    <Container maxWidth="lg">
      {content.map((node) => (
        <RecursiveElement key={node.title} node={node} />
      ))}
    </Container>
  );
}
