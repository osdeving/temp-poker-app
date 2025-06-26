'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, AuthProvider } from '@/hooks/use-auth';
import LoginForm from '@/components/auth/login-form';

function HomePage() {
  const { auth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (auth.user) {
      router.push('/dashboard');
    }
  }, [auth.user, router]);

  if (auth.user) {
    return <div>Redirecting...</div>;
  }

  return <LoginForm />;
}

export default function Home() {
  return (
    <AuthProvider>
      <HomePage />
    </AuthProvider>
  );
}