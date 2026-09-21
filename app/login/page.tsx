import { FullScreenLogin } from '@/components/ui/full-screen-login';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login | IP-SAKTI Sahayak',
  description: 'Log in to your IP-SAKTI Sahayak account to access your Ayurveda IP workspace.',
};

export default function LoginPage() {
  return <FullScreenLogin />;
}
