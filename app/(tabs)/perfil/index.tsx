// PerfilScreen.js
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useNavigation } from 'expo-router';
import React, { useLayoutEffect } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// 🔹 Datos del usuario (luego vendrán de tu auth context o API)
const USUARIO = {
  nombre: 'Juan Pérez',
  email: 'juan@publicidaddas.com',
  telefono: '+57 300 123 4567',
  rol: 'Administrador',
  avatar: '👤',
};

export default function PerfilScreen() {
  const router = useRouter();
  const navigation = useNavigation();

  // Ocultar header nativo y tab bar al montar
  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: 'none' } });
    return () => parent?.setOptions({ tabBarStyle: { display: 'flex' } });
  }, [navigation]);

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: () => router.replace('/auth/login'),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1B365D" />

      {/* 🔷 HEADER CON GRADIENTE */}
      <LinearGradient
        colors={['#1B365D', '#2d4a73']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        {/* Navigation */}
        <View style={styles.headerNav}>
          <TouchableOpacity 
            style={styles.backBtn}
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={20} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mi Perfil</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Avatar Container */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{USUARIO.avatar}</Text>
          </View>
          <Text style={styles.userName}>{USUARIO.nombre}</Text>
          <View style={styles.userRole}>
            <Text style={styles.userRoleText}>{USUARIO.rol}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* 🔷 CONTENIDO */}
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        
        {/* Info Card - Solo visualización */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Información Personal</Text>

          {/* Nombre */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Nombre completo</Text>
            <View style={styles.fieldRow}>
              <Ionicons name="person" size={20} color="#999" />
              <Text style={styles.fieldValue}>{USUARIO.nombre}</Text>
            </View>
          </View>

          {/* Email */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Correo electrónico</Text>
            <View style={styles.fieldRow}>
              <Ionicons name="mail" size={20} color="#999" />
              <Text style={styles.fieldValue}>{USUARIO.email}</Text>
            </View>
          </View>

          {/* Teléfono */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Teléfono</Text>
            <View style={styles.fieldRow}>
              <Ionicons name="call" size={20} color="#999" />
              <Text style={styles.fieldValue}>{USUARIO.telefono}</Text>
            </View>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutBtn} 
          onPress={handleLogout} 
          activeOpacity={0.95}
        >
          <Ionicons name="log-out" size={20} color="#dc2626" />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  
  // 🔷 Header
  header: {
    height: 280,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
  },
  headerNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  backBtn: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 36, // Para equilibrar el layout con el botón de regreso
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  avatar: {
    width: 108,
    height: 108,
    borderRadius: 54,
    backgroundColor: '#ffffff',
    borderWidth: 3,
    borderColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  avatarText: {
    fontSize: 60,
  },
  userName: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  userRole: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  userRoleText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },

  // 🔷 Content
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 30,
  },

  // Info Card - Solo visualización
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B365D',
    marginBottom: 24,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  fieldValue: {
    fontSize: 15,
    color: '#333',
    flex: 1,
  },

  // Logout Button
  logoutBtn: {
    backgroundColor: '#fee2e2',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  logoutText: {
    color: '#dc2626',
    fontSize: 16,
    fontWeight: '600',
  },
});