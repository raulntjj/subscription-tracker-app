import { RegisterContainer } from '@/modules/auth/components/containers/register-container';

export const metadata = {
  title: 'Create Account - SubTracker',
  description: 'Create your SubTracker account and start tracking subscriptions.',
};

export default function RegisterPage() {
  return <RegisterContainer />;
}
