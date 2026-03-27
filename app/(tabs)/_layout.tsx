import { Tabs } from 'expo-router';
import BottomNavBar from '@/components/BottomNavBar';
import { View, StyleSheet } from 'react-native';

export default function TabsLayout() {
  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' }, 
        }}
      >
        <Tabs.Screen name="index" options={{ title: 'Home' }} />
        <Tabs.Screen name="ventas" options={{ title: 'Ventas' }} />
        <Tabs.Screen name="pedidos" options={{ title: 'Pedidos' }} />
      </Tabs>
      <BottomNavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});