import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useNavigation } from 'expo-router';
import React, { useLayoutEffect, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

// 🔹 Datos del usuario (luego vendrán de tu auth context o API)
const USUARIO_INICIAL = {
  nombre: 'Juan Pérez',
  email: 'juan@publicidaddas.com',
  telefono: '3001234567',
  rol: 'Administrador',
  avatar: '👤',
};

export default function PerfilScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(USUARIO_INICIAL);
  const [errors, setErrors] = useState({
    nombre: '',
    email: '',
    telefono: '',
  });

  // Ocultar header nativo y tab bar al montar
  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: 'none' } });
    return () => parent?.setOptions({ tabBarStyle: { display: 'flex' } });
  }, [navigation]);

  // Formatear teléfono para mostrar
  const formatPhoneForDisplay = (phone: string) => {
    const numbers = phone.replace(/\D/g, '');
    if (numbers.length === 10) {
      return `${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(6, 10)}`;
    }
    return phone;
  };

  // Validaciones
  const validateNombre = (nombre: string) => {
    if (!nombre.trim()) return 'El nombre es obligatorio';
    if (nombre.trim().length < 3) return 'El nombre debe tener al menos 3 caracteres';
    if (nombre.trim().length > 50) return 'El nombre no puede exceder 50 caracteres';
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre)) return 'El nombre solo puede contener letras y espacios';
    return '';
  };

  const validateEmail = (email: string) => {
    if (!email.trim()) return 'El correo es obligatorio';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Ingrese un correo válido (ejemplo@dominio.com)';
    return '';
  };

  const validateTelefono = (telefono: string) => {
    if (!telefono.trim()) return 'El teléfono es obligatorio';
    const cleanNumber = telefono.replace(/\D/g, '');
    if (cleanNumber.length !== 10) return 'El teléfono debe tener exactamente 10 dígitos';
    return '';
  };

  const handleChange = (field: string, value: string) => {
    let error = '';
    let formattedValue = value;
    
    if (field === 'telefono') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 10) formattedValue = formattedValue.slice(0, 10);
      error = validateTelefono(formattedValue);
    } else if (field === 'nombre') {
      error = validateNombre(value);
    } else if (field === 'email') {
      error = validateEmail(value);
    }
    
    setUserData(prev => ({ ...prev, [field]: formattedValue }));
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleSave = () => {
    const nombreError = validateNombre(userData.nombre);
    const emailError = validateEmail(userData.email);
    const telefonoError = validateTelefono(userData.telefono);
    
    setErrors({
      nombre: nombreError,
      email: emailError,
      telefono: telefonoError,
    });
    
    if (nombreError || emailError || telefonoError) {
      Alert.alert('Error', 'Por favor corrija los errores antes de guardar');
      return;
    }
    
    Alert.alert('Éxito', 'Perfil actualizado correctamente');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setUserData(USUARIO_INICIAL);
    setErrors({ nombre: '', email: '', telefono: '' });
    setIsEditing(false);
  };

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
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >

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
              <Text style={styles.avatarText}>{USUARIO_INICIAL.avatar}</Text>
            </View>
            {!isEditing && (
              <>
                <Text style={styles.userName}>{userData.nombre}</Text>
                <View style={styles.userRole}>
                  <Text style={styles.userRoleText}>{userData.rol}</Text>
                </View>
              </>
            )}
          </View>
        </LinearGradient>

        {/* 🔷 CONTENIDO */}
        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
        >
          
          {/* Info Card */}
          <View style={styles.infoCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.infoTitle}>Información Personal</Text>
              {!isEditing && (
                <TouchableOpacity style={styles.editIconBtn} onPress={() => setIsEditing(true)}>
                  <Ionicons name="create-outline" size={20} color="#1B365D" />
                </TouchableOpacity>
              )}
            </View>

            {/* Nombre */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Nombre completo</Text>
              <View style={styles.fieldRow}>
                <Ionicons name="person" size={20} color="#999" />
                {isEditing ? (
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={[styles.input, errors.nombre && styles.inputError]}
                      value={userData.nombre}
                      onChangeText={(text) => handleChange('nombre', text)}
                      placeholder="Ingrese su nombre"
                      placeholderTextColor="#aaa"
                    />
                    {errors.nombre && <Text style={styles.errorText}>{errors.nombre}</Text>}
                  </View>
                ) : (
                  <Text style={styles.fieldValue}>{userData.nombre}</Text>
                )}
              </View>
            </View>

            {/* Email */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Correo electrónico</Text>
              <View style={styles.fieldRow}>
                <Ionicons name="mail" size={20} color="#999" />
                {isEditing ? (
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={[styles.input, errors.email && styles.inputError]}
                      value={userData.email}
                      onChangeText={(text) => handleChange('email', text)}
                      placeholder="correo@ejemplo.com"
                      placeholderTextColor="#aaa"
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                    {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                  </View>
                ) : (
                  <Text style={styles.fieldValue}>{userData.email}</Text>
                )}
              </View>
            </View>

            {/* Teléfono */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Teléfono</Text>
              <View style={styles.fieldRow}>
                <Ionicons name="call" size={20} color="#999" />
                {isEditing ? (
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={[styles.input, errors.telefono && styles.inputError]}
                      value={userData.telefono}
                      onChangeText={(text) => handleChange('telefono', text)}
                      placeholder="3001234567"
                      placeholderTextColor="#aaa"
                      keyboardType="phone-pad"
                      maxLength={10}
                    />
                    {errors.telefono && <Text style={styles.errorText}>{errors.telefono}</Text>}
                    <Text style={styles.inputHint}>10 dígitos sin espacios</Text>
                  </View>
                ) : (
                  <Text style={styles.fieldValue}>{formatPhoneForDisplay(userData.telefono)}</Text>
                )}
              </View>
            </View>

            {/* Botones de acción */}
            {isEditing && (
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
                  <Ionicons name="close-outline" size={18} color="#dc2626" />
                  <Text style={styles.cancelBtnText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                  <Ionicons name="checkmark-outline" size={18} color="white" />
                  <Text style={styles.saveBtnText}>Guardar</Text>
                </TouchableOpacity>
              </View>
            )}
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  flex: {
    flex: 1,
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
    marginTop: 20, // Este valor NO se modifica
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
    width: 36,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: -15, // 👈 REDUCÍ ESTE VALOR para subir avatar, nombre y rol
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
    marginBottom: 12, // 👈 REDUCÍ para acercar nombre al avatar
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
    marginBottom: 4, // 👈 REDUCÍ para acercar rol al nombre
  },
  userRole: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 4, // 👈 REDUCÍ padding vertical
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  userRoleText: {
    color: '#ffffff',
    fontSize: 13, // 👈 REDUCÍ un poco el tamaño
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

  // Info Card
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B365D',
  },
  editIconBtn: {
    padding: 8,
    backgroundColor: '#f0f2f5',
    borderRadius: 20,
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
    alignItems: 'flex-start',
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
  inputWrapper: {
    flex: 1,
  },
  input: {
    fontSize: 15,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#dc2626',
  },
  errorText: {
    fontSize: 10,
    color: '#dc2626',
    marginTop: 4,
  },
  inputHint: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#fee2e2',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  cancelBtnText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '600',
  },
  saveBtn: {
    flex: 1,
    backgroundColor: '#1B365D',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  saveBtnText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
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