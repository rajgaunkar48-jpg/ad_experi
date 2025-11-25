import { Tabs, useRouter } from 'expo-router';
import { Home, Stethoscope, Pill, FileText } from 'lucide-react-native';
import { TouchableOpacity, Text, View } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '@/utils/firebase';
import useAuth from '@/hooks/useAuth';

export default function TabLayout() {
  const router = useRouter();
  const { user } = useAuth();
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E5EA',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerRight: () => (
          user ? (
            <TouchableOpacity onPress={async () => { await signOut(auth); router.replace?.('/login'); }} style={{ paddingHorizontal: 12 }}>
              <Text style={{ color: '#FFFFFF' }}>Sign out</Text>
            </TouchableOpacity>
          ) : null
        ),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color }: { size?: number; color?: string }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="symptoms"
        options={{
          title: 'Symptoms',
          tabBarIcon: ({ size, color }: { size?: number; color?: string }) => (
            <Stethoscope size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="medicine"
        options={{
          title: 'Medicine Log',
          tabBarIcon: ({ size, color }: { size?: number; color?: string }) => <Pill size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="report"
        options={{
          title: 'Health Report',
          tabBarIcon: ({ size, color }: { size?: number; color?: string }) => (
            <FileText size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
