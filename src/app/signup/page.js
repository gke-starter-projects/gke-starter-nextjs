'use server';

import SignupForm from '../../components/SignupForm';
import { handleSignup } from './api';

export default async function SignupPage() {
  return (
    <SignupForm onSubmit={handleSignup} />
  );
}
