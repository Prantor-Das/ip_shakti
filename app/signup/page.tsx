import { FullScreenSignup } from '@/components/ui/full-screen-signup';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up | IP-SAKTI Sahayak',
  description: 'Sign up for IP-SAKTI Sahayak.',
};

export default function SignupPage() {
  return <FullScreenSignup />;
}
