'use client';

export const handleSignup = async (userData) => {
  const response = await fetch('/api/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Signup failed');
  }

  return response.json();
};

export const foo = 'bar';
