'use server';

import SignupForm from './SignupForm';
import { handleSignup } from './api';

export default async function SignupPage() {
  return (
    <SignupForm onSubmit={handleSignup} />
  );
}
