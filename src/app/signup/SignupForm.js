'use client';

import React from 'react';
import { Formik, Form } from 'formik';
import { useRouter } from 'next/navigation';

import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
  CircularProgress,
} from '@mui/material';
import signupValidationSchema from '../../schemas/signup';

function SignupForm({ onSubmit = () => Promise.reject(new Error('onSubmit handler not provided')) }) {
  const router = useRouter();

  const initialValues = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h5">
            Create your account
          </Typography>

          <Formik
            initialValues={initialValues}
            validationSchema={signupValidationSchema}
            onSubmit={async (values, { setSubmitting, setStatus, resetForm }) => {
              try {
                await onSubmit({
                  username: values.username,
                  email: values.email,
                  password: values.password,
                });
                setStatus({ success: 'Account created successfully!' });
                resetForm();
                // Successful signup
                router.push('/dashboard');
              } catch (error) {
                setStatus({ error: error.message });
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({
              errors, touched, handleChange, handleBlur, values, isSubmitting, status,
            }) => (
              <Box component={Form} sx={{ mt: 3 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  value={values.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.username && !!errors.username}
                  helperText={touched.username && errors.username}
                />

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && !!errors.email}
                  helperText={touched.email && errors.email}
                />

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && !!errors.password}
                  helperText={touched.password && errors.password}
                />

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.confirmPassword && !!errors.confirmPassword}
                  helperText={touched.confirmPassword && errors.confirmPassword}
                />

                {status?.error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {status.error}
                </Alert>
                )}

                {status?.success && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  {status.success}
                </Alert>
                )}

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Sign Up'
                  )}
                </Button>
              </Box>
            )}
          </Formik>
        </Paper>
      </Box>
    </Container>
  );
}

export default SignupForm;
