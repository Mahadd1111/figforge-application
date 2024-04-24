"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function Home() {
  const { isAuthorized, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthorized) {
        router.push('/signin');
      } else {
        router.push('/dashboard');
      }
    }
  }, [isAuthorized, loading, router]);

  if (loading) return <div>Loading...</div>;
  
  return null;
}
