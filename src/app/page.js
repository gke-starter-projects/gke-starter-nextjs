import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import NextLink from 'next/link';

export default function Home() {
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          my: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          NextJS starter app
        </Typography>
        <Link href="/signup" color="secondary" component={NextLink}>
          Signup
        </Link>
        <Link href="/login" color="secondary" component={NextLink}>
          Login
        </Link>
      </Box>
    </Container>
  );
}
