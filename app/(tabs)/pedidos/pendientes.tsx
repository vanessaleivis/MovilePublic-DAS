// pedidos/pendientes.tsx
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useNavigation } from 'expo-router';
import React, { useMemo, useState, useLayoutEffect } from 'react';
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import BottomNavBar from '../../../components/BottomNavBar'; // Ajusta la ruta según tu estructura

// 🔹 Tipo
type PedidoPendiente = {
  PedidoClienteId: string;
  ClienteNombre: string;
  ClienteCorreo: string;
  FechaRegistro: string;
  Total: number;
  Estado: 'pendiente';
  TipoCliente: 'registrado' | 'walkin';
};

// 🔹 Datos de ejemplo - SOLO PENDIENTES (reemplazar con API filtrada)
const DATA: PedidoPendiente[] = [
  {
    PedidoClienteId: 'f3a1b2c3-d401-4e5f-8a9b-0c1d2e3f4a02',
    ClienteNombre: 'Tech Solutions Ltda',
    ClienteCorreo: 'contact@techsolutions.com',
    FechaRegistro: '2025-04-19T14:08:00',
    Total: 1230000,
    Estado: 'pendiente',
    TipoCliente: 'registrado',
  },
  {
    PedidoClienteId: 'f3a1b2c3-d401-4e5f-8a9b-0c1d2e3f4a04',
    ClienteNombre: 'Distribuidora Central',
    ClienteCorreo: 'info@distcentral.com',
    FechaRegistro: '2025-04-15T16:44:00',
    Total: 750000,
    Estado: 'pendiente',
    TipoCliente: 'registrado',
  },
  {
    PedidoClienteId: 'f3a1b2c3-d401-4e5f-8a9b-0c1d2e3f4a06',
    ClienteNombre: 'Carlos Ruiz',
    ClienteCorreo: 'carlos.ruiz@email.com',
    FechaRegistro: '2025-04-24T09:30:00',
    Total: 320000,
    Estado: 'pendiente',
    TipoCliente: 'walkin',
  },
];

// 🔹 Paleta de colores
const PAL = [
  { bg: '#EDE9FE', c: '#7C3AED' },
  { bg: '#D1FAE5', c: '#059669' },
  { bg: '#DBEAFE', c: '#2563EB' },
  { bg: '#FEF3C7', c: '#D97706' },
  { bg: '#FCE7F3', c: '#DB2777' },
];

// 🔹 Helpers
const getInitials = (name: string) =>
  name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();

const formatPrice = (n: number) => '$ ' + Number(n).toLocaleString('es-CO');

const formatDate = (dt: string) => {
  const d = new Date(dt);
  return d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short' });
};

export default function PedidosPendientesScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');

  // Ocultar header y tab bar
  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: 'none' } });
    return () => parent?.setOptions({ tabBarStyle: { display: 'flex' } });
  }, [navigation]);

  // Filtrar solo por búsqueda (sin filtros de estado)
  const filteredData = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return DATA.filter((d) =>
      !q ||
      d.ClienteNombre.toLowerCase().includes(q) ||
      d.ClienteCorreo.toLowerCase().includes(q) ||
      d.PedidoClienteId.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const renderCard = ({ item, index }: { item: PedidoPendiente; index: number }) => {
    const palette = PAL[index % PAL.length];

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.95}
        onPress={() => router.push(`/pedidos/${item.PedidoClienteId}`)}
      >
        {/* Avatar */}
        <View style={[styles.avatar, { backgroundColor: palette.bg }]}>
          <Text style={[styles.avatarText, { color: palette.c }]}>
            {getInitials(item.ClienteNombre)}
          </Text>
        </View>

        {/* Contenido */}
        <View style={styles.cbody}>
          <Text style={styles.cname} numberOfLines={1}>{item.ClienteNombre}</Text>
          <View style={styles.ctagRow}>
            <View style={[styles.sbadge, { backgroundColor: '#FEF3C7' }]}>
              <Text style={[styles.sbadgeText, { color: '#D97706' }]}>Pendiente</Text>
            </View>
            <View style={[styles.tipoBadge, {
              backgroundColor: item.TipoCliente === 'registrado' ? '#DBEAFE' : '#FFF7ED',
            }]}>
              <Text style={[styles.tipoBadgeText, {
                color: item.TipoCliente === 'registrado' ? '#2563EB' : '#C2410C',
              }]}>
                {item.TipoCliente === 'registrado' ? 'Registrado' : 'Walk-in'}
              </Text>
            </View>
          </View>
          <Text style={styles.cdate}>{formatDate(item.FechaRegistro)}</Text>
        </View>

        {/* Right column */}
        <View style={styles.cright}>
          <Text style={styles.ctotal}>{formatPrice(item.Total)}</Text>
          <View style={styles.arrowCircle}>
            <Ionicons name="chevron-forward" size={16} color="#1B365D" />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1B365D" />

      {/* Header - Título fijo "Pendientes" */}
      <LinearGradient
        colors={['#1B365D', '#2d4a73']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={18} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pedidos Pendientes</Text>
        <View style={styles.headerSpacer} />
      </LinearGradient>

      {/* Search - Sin filtros */}
      <View style={styles.searchArea}>
        <View style={styles.searchWrapper}>
          <Ionicons name="search" size={16} color="#7A8BAA" style={styles.sIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar pedido pendiente…"
            placeholderTextColor="#7A8BAA"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity style={styles.clearBtn} onPress={() => setSearchQuery('')}>
              <Text style={styles.clearBtnText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
        {/* ✅ Sin chips de filtro - solo búsqueda */}
      </View>

      {/* List */}
      <FlatList
        data={filteredData}
        renderItem={renderCard}
        keyExtractor={(item) => item.PedidoClienteId}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyText}>No hay pedidos pendientes</Text>
            <Text style={styles.emptySub}>¡Todo al día! 🎉</Text>
          </View>
        }
      />

      {/* ✅ Bottom NavBar - Agregado aquí */}
      <BottomNavBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EEF1F8' },
  header: {
    padding: 22, paddingBottom: 37, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28, overflow: 'hidden', paddingTop: 38,
  },
  backBtn: {
    width: 38, height: 38, backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12, alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontFamily: 'PlayfairDisplay_600Regular', color: '#ffffff', fontSize: 21 },
  headerSpacer: { width: 38 },
  searchArea: {
    backgroundColor: '#ffffff', padding: 14, paddingBottom: 0,
    borderBottomWidth: 1, borderBottomColor: '#DDE3EE',
  },
  searchWrapper: { position: 'relative', marginBottom: 14 },
  searchInput: {
    backgroundColor: '#EEF1F8', borderWidth: 1.5, borderColor: '#DDE3EE',
    borderRadius: 14, paddingVertical: 11, paddingHorizontal: 42,
    fontSize: 14, color: '#1B365D',
  },
  sIcon: { position: 'absolute', left: 14, top: '50%', marginTop: -8 },
  clearBtn: {
    position: 'absolute', right: 12, top: '50%', marginTop: -11,
    backgroundColor: '#DDE3EE', width: 22, height: 22, borderRadius: 11,
    alignItems: 'center', justifyContent: 'center',
  },
  clearBtnText: { fontSize: 11, color: '#7A8BAA' },
  content: {
    padding: 16,
    paddingBottom: 90, // ✅ Espacio para que el navbar no tape el último elemento
  },
  card: {
    backgroundColor: '#ffffff', borderRadius: 18, padding: 14, marginBottom: 10,
    flexDirection: 'row', gap: 12, shadowColor: '#1B365D',
    shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06,
    shadowRadius: 3, elevation: 2,
  },
  avatar: {
    width: 44, height: 44, borderRadius: 13, alignItems: 'center',
    justifyContent: 'center', marginTop: 2,
  },
  avatarText: { fontWeight: '700', fontSize: 14 },
  cbody: { flex: 1 },
  cname: { fontSize: 14, fontWeight: '600', color: '#1B365D', marginBottom: 4 },
  ctagRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  sbadge: { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 7 },
  sbadgeText: { fontSize: 10, fontWeight: '600', letterSpacing: 0.3, textTransform: 'uppercase' },
  tipoBadge: { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 7 },
  tipoBadgeText: { fontSize: 10, fontWeight: '600', letterSpacing: 0.3, textTransform: 'uppercase' },
  cdate: { fontSize: 11, color: '#7A8BAA' },
  cright: { alignItems: 'flex-end', justifyContent: 'space-between' },
  ctotal: { fontSize: 14, fontWeight: '700', color: '#1B365D' },
  arrowCircle: {
    width: 30, height: 30, borderRadius: 9, backgroundColor: '#EEF1F8',
    alignItems: 'center', justifyContent: 'center',
  },
  empty: { alignItems: 'center', padding: 60, gap: 10 },
  emptyIcon: { fontSize: 42, opacity: 0.25 },
  emptyText: { color: '#7A8BAA', fontSize: 14, fontWeight: '600' },
  emptySub: { color: '#A0B3C7', fontSize: 12 },
});