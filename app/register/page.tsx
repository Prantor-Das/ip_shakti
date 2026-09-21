import { FullScreenSignup } from '@/components/ui/full-screen-signup';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register | IP-SAKTI Sahayak',
  description:
    'Create an account on IP-SAKTI Sahayak to access Ayurveda IP and regulatory compliance tools.',
};

export default function RegisterPage() {
  return <FullScreenSignup />;
}
