import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, Pressable, View, StyleProp, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  const insets = useSafeAreaInsets();
  
  // Estado para el item activo
  const [activeItem, setActiveItem] = useState<string>('Home');
  
  // Sincronizar activeItem con la ruta actual
  useEffect(() => {
    if (pathname) {
      if (pathname === '/' || pathname === '/(tabs)') {
        setActiveItem('Home');
      } else if (pathname.includes('/perfil')) {
        setActiveItem('Perfil');
      } else if (pathname.includes('/ventas')) {
        setActiveItem('Ventas');
      } else if (pathname.includes('/pedidos')) {
        setActiveItem('Pedidos');
      }
    }
  }, [pathname]);

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

  const getNavItemStyle = (pressed: boolean, isActive: boolean): StyleProp<ViewStyle> => [
    styles.navItem,
    pressed && styles.navItemHover,
    isActive && styles.navItemActive,
  ].filter(Boolean);

  return (
    <View style={[styles.navbarWrapper, { paddingBottom: insets.bottom > 0 ? insets.bottom : 12 }]}>
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
                size={22}
                color={isActive ? '#4A9EFF' : 'rgba(255,255,255,0.6)'}
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
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  navbar: {
    backgroundColor: '#1B365D',
    borderRadius: 32,
    paddingVertical: 10,
    paddingHorizontal: 8,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 20,
  },
  navItem: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 24,
    minWidth: 70,
  },
  navItemHover: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  navItemActive: {
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  navLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 0.3,
  },
  navLabelActive: {
    color: '#4A9EFF',
    fontWeight: '700',
  },
});