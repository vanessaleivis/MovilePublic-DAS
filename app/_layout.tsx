import BottomNavBar from '@/components/BottomNavBar';
import { Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function RootLayout() {
  const pathname = usePathname();
  
  //  Mostrar NavBar solo en rutas de tabs (no en auth)
  const showNavBar = pathname?.startsWith('/(tabs)') || pathname === '/';

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar style="auto" />
        
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="auth" />
          <Stack.Screen name="(tabs)" />
        </Stack>
        
        {/* ✅ BottomNavBar flotante - solo en tabs */}
        {showNavBar && <BottomNavBar />}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
});