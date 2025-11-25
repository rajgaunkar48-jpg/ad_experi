import React, { JSX, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
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
    <View style={styles.container}>
      <View style={styles.card}>
        {user ? (
          <View style={{ marginBottom: 10 }}>
            <Text style={{ color: '#6C757D' }}>Already signed in</Text>
          </View>
        ) : null}
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to get started</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput value={email} onChangeText={setEmail} style={styles.input} placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" placeholderTextColor="#ADB5BD" />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput value={password} onChangeText={setPassword} secureTextEntry style={styles.input} placeholder="At least 6 characters" placeholderTextColor="#ADB5BD" />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry style={styles.input} placeholder="Confirm your password" placeholderTextColor="#ADB5BD" />
        </View>

        <TouchableOpacity style={styles.button} onPress={onSignup} disabled={isLoading}>
          <Text style={styles.buttonText}>{isLoading ? 'Creating...' : 'Create account'}</Text>
        </TouchableOpacity>

        <View style={styles.row}>
          <Text style={styles.smallText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={[styles.smallText, styles.link]}> Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', justifyContent: 'center', padding: 16 },
  card: { backgroundColor: '#FFF', borderRadius: 12, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  title: { fontSize: 22, fontWeight: '700', color: '#1A1A1A' },
  subtitle: { marginTop: 4, color: '#6C757D' },
  inputGroup: { marginTop: 12 },
  label: { color: '#1A1A1A', fontSize: 14, marginBottom: 6 },
  input: { backgroundColor: '#F8F9FA', borderRadius: 12, padding: 12, fontSize: 16 },
  button: { marginTop: 18, backgroundColor: '#007AFF', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#FFF', fontWeight: '600' },
  row: { flexDirection: 'row', marginTop: 12, justifyContent: 'center', alignItems: 'center' },
  smallText: { color: '#6C757D' },
  link: { color: '#007AFF', fontWeight: '700' },
});
