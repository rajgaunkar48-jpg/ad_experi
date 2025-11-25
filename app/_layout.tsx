import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import useAuth from '@/hooks/useAuth';
// Initialize Firebase on app startup (UI-only if values are empty)
import '@/utils/firebase';

export default function RootLayout() {
  useFrameworkReady();
  const { user, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // While loading, avoid redirects
    if (loading) return;

    // If user not signed in and not on login/signup page → redirect to login
    const onAuthRoutes = segments.includes('login') || segments.includes('signup');
    if (!user && !onAuthRoutes) {
      router.replace?.('/login');
      return;
    }

    // If user is signed in and currently on auth pages, send to root
    if (user && onAuthRoutes) {
      router.replace?.('/');
      return;
    }
  }, [user, loading, segments]);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
