import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, Pressable, View, StyleProp, ViewStyle } from 'react-native';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

type NavItem = {
  name: string;
  icon: IconName;
  activeIcon: IconName;
  route: string;  
};

export default function BottomNavBar() {
  const router = useRouter();
  const pathname = usePathname();

  const authRoutes = ['/login'];
  const shouldHide = authRoutes.some(route => pathname?.startsWith(route));

  if (shouldHide) return null;

  const [activeItem, setActiveItem] = useState<string>('Home');

  const navItems: NavItem[] = [
    { name: 'Perfil', icon: 'person-outline', activeIcon: 'person', route: '/perfil' },
    { name: 'Ventas', icon: 'trending-up-outline', activeIcon: 'trending-up', route: '/ventas' },
    { name: 'Home', icon: 'home-outline', activeIcon: 'home', route: '/' },
    { name: 'Pedidos', icon: 'cart-outline', activeIcon: 'cart', route: '/pedidos' },
  ];

  const handlePress = (item: NavItem) => {
    setActiveItem(item.name);
    router.push(item.route);  
  };

  // 👇 Helper para construir estilos del Pressable de forma segura
  const getNavItemStyle = (pressed: boolean, isActive: boolean): StyleProp<ViewStyle> => [
    styles.navItem,
    pressed && styles.navItemHover,
    isActive && styles.navItemActive,
  ].filter(Boolean); // ✅ Filtra valores false/undefined para evitar warnings

  return (
    <View style={styles.navbarWrapper}>
      <View style={styles.navbar}>
        {navItems.map((item) => {
          const isActive = activeItem === item.name;
          const iconName = isActive ? item.activeIcon : item.icon;

          return (
            <Pressable
              key={item.name}
              onPress={() => handlePress(item)}
              style={({ pressed }) => getNavItemStyle(pressed, isActive)}
            >
              <Ionicons
                name={iconName}
                size={23}
                color={isActive ? '#4A9EFF' : 'rgba(255,255,255,0.55)'}
              />
              <Text style={[
                styles.navLabel,
                isActive && styles.navLabelActive,
              ]}>
                {item.name}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbarWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 18,
    paddingBottom: 26,
  },
  navbar: {
    backgroundColor: '#1B365D',
    borderRadius: 28,
    paddingVertical: 8,
    paddingHorizontal: 6,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#1B365D',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 40,
    elevation: 20,
  },
  navItem: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18,
    minWidth: 68,
  },
  navItemHover: {
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  navItemActive: {
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.45)',
    letterSpacing: 0.3,
  },
  navLabelActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
});