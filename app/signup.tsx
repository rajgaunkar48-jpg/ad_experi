import React, { JSX, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import newStyles from '@/app/uiStyles';
import { useRouter } from 'expo-router';
import useAuth from '@/hooks/useAuth';
import { useEffect } from 'react';
import { auth } from '@/utils/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export default function SignupScreen(): JSX.Element {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.replace?.('/');
    }
  }, [user, loading]);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const onSignup = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Validation', 'Please enter email and password');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Validation', 'Passwords do not match');
      return;
    }
    setIsLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      // Redirect to home automatically
      router.replace?.('/');
    } catch (err: any) {
      Alert.alert('Signup failed', err?.message ?? 'Please try again');
      console.error('Signup error', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={newStyles.container}>
      <View style={newStyles.card}>
        {user ? (
          <View style={{ marginBottom: 10 }}>
            <Text style={newStyles.alreadySignedInText}>Already signed in</Text>
          </View>
        ) : null}
        <Text style={newStyles.title}>Create Account</Text>
        <Text style={newStyles.subtitle}>Sign up to get started</Text>

        <View style={newStyles.inputGroup}>
          <Text style={newStyles.label}>Email</Text>
          <TextInput value={email} onChangeText={setEmail} style={newStyles.input} placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" placeholderTextColor="#9CA3AF" />
        </View>

        <View style={newStyles.inputGroup}>
          <Text style={newStyles.label}>Password</Text>
          <TextInput value={password} onChangeText={setPassword} secureTextEntry style={newStyles.input} placeholder="At least 6 characters" placeholderTextColor="#9CA3AF" />
        </View>

        <View style={newStyles.inputGroup}>
          <Text style={newStyles.label}>Confirm Password</Text>
          <TextInput value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry style={newStyles.input} placeholder="Confirm your password" placeholderTextColor="#9CA3AF" />
        </View>

        <TouchableOpacity style={newStyles.button} onPress={onSignup} disabled={isLoading}>
          <Text style={newStyles.buttonText}>{isLoading ? 'Creating...' : 'Create account'}</Text>
        </TouchableOpacity>

        <View style={newStyles.row}>
          <Text style={newStyles.smallText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={[newStyles.smallText, newStyles.link]}> Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
// Styles were moved to shared '@/app/uiStyles'
