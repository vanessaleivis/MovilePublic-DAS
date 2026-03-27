import { Stack } from 'expo-router';

export default function VentasLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: 'Ventas' }} />
      <Stack.Screen name="semanales" options={{ title: 'Semanal' }} />
      <Stack.Screen name="mensuales" options={{ title: 'Mensual' }} />
    </Stack>
  );
}