import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
    FlatList,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

// Tipos
type Pedido = {
  PedidoClienteId: string;
  ClienteId: string;
  FechaRegistro: string;
  Total: number;
  Estado: 'pendiente' | 'aprobado' | 'entregado' | 'cancelado';
  MetodoPago: string;
  NombreRecibe: string;
  TelefonoEntrega: string;
  DireccionEntrega: string;
  Voucher: string | null;
  ClienteNombre: string;
  ClienteTelefono: string;
  ClienteCorreo: string;
  TipoCliente: 'registrado' | 'walkin';
};

// Datos de ejemplo (reemplazar con tu API)
const DATA: Pedido[] = [
  {
    PedidoClienteId: 'f3a1b2c3-d401-4e5f-8a9b-0c1d2e3f4a01',
    ClienteId: 'c1-0001',
    FechaRegistro: '2025-04-21T10:32:00',
    Total: 485000,
    Estado: 'aprobado',
    MetodoPago: 'transferencia',
    NombreRecibe: 'Laura Martínez',
    TelefonoEntrega: '+57 300 123 4567',
    DireccionEntrega: 'Cra 15 #93-47 Apto 301, Bogotá',
    Voucher: 'TXN-20250421-00441',
    ClienteNombre: 'Empresas S.A.S',
    ClienteTelefono: '+57 601 555 0001',
    ClienteCorreo: 'empresassas@gmail.com',
    TipoCliente: 'registrado',
  },
  {
    PedidoClienteId: 'f3a1b2c3-d401-4e5f-8a9b-0c1d2e3f4a02',
    ClienteId: 'c1-0002',
    FechaRegistro: '2025-04-19T14:08:00',
    Total: 1230000,
    Estado: 'pendiente',
    MetodoPago: 'contra_entrega',
    NombreRecibe: 'Carlos Ruiz',
    TelefonoEntrega: '+57 310 987 6543',
    DireccionEntrega: 'Av. El Dorado #69-76 Of. 204, Bogotá',
    Voucher: null,
    ClienteNombre: 'Tech Solutions Ltda',
    ClienteTelefono: '+57 601 555 0002',
    ClienteCorreo: 'contact@techsolutions.com',
    TipoCliente: 'registrado',
  },
  {
    PedidoClienteId: 'f3a1b2c3-d401-4e5f-8a9b-0c1d2e3f4a03',
    ClienteId: 'c1-0003',
    FechaRegistro: '2025-04-18T09:15:00',
    Total: 320000,
    Estado: 'entregado',
    MetodoPago: 'transferencia',
    NombreRecibe: 'Ana Gómez',
    TelefonoEntrega: '+57 315 444 1122',
    DireccionEntrega: 'Calle 80 #50-23 Piso 2, Medellín',
    Voucher: 'TXN-20250418-00320',
    ClienteNombre: 'Comercial del Norte',
    ClienteTelefono: '+57 604 555 0003',
    ClienteCorreo: 'ventas@comercialnorte.com',
    TipoCliente: 'walkin',
  },
  {
    PedidoClienteId: 'f3a1b2c3-d401-4e5f-8a9b-0c1d2e3f4a04',
    ClienteId: 'c1-0004',
    FechaRegistro: '2025-04-15T16:44:00',
    Total: 750000,
    Estado: 'pendiente',
    MetodoPago: 'transferencia',
    NombreRecibe: 'Mario López',
    TelefonoEntrega: '+57 312 333 4455',
    DireccionEntrega: 'Zona Industrial Calle 13 #36-45, Cali',
    Voucher: 'TXN-20250415-00219',
    ClienteNombre: 'Distribuidora Central',
    ClienteTelefono: '+57 602 555 0004',
    ClienteCorreo: 'info@distcentral.com',
    TipoCliente: 'registrado',
  },
  {
    PedidoClienteId: 'f3a1b2c3-d401-4e5f-8a9b-0c1d2e3f4a05',
    ClienteId: 'c1-0005',
    FechaRegistro: '2025-04-12T11:55:00',
    Total: 195000,
    Estado: 'cancelado',
    MetodoPago: 'contra_entrega',
    NombreRecibe: 'Sofía Vargas',
    TelefonoEntrega: '+57 317 777 8899',
    DireccionEntrega: 'Cra 27 #15-62, Barranquilla',
    Voucher: null,
    ClienteNombre: 'Inversiones del Sur',
    ClienteTelefono: '+57 605 555 0005',
    ClienteCorreo: 'contacto@inversursur.com',
    TipoCliente: 'walkin',
  },
];

// Paleta de colores para avatares
const PAL = [
  { bg: '#EDE9FE', c: '#7C3AED' },
  { bg: '#D1FAE5', c: '#059669' },
  { bg: '#DBEAFE', c: '#2563EB' },
  { bg: '#FEF3C7', c: '#D97706' },
  { bg: '#FCE7F3', c: '#DB2777' },
  { bg: '#FEE2E2', c: '#DC2626' },
  { bg: '#E0F2FE', c: '#0369A1' },
];

// Mapeo de estados
const SL: Record<Pedido['Estado'], string> = {
  pendiente: 'Pendiente',
  aprobado: 'Aprobado',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
};

const SC: Record<Pedido['Estado'], { bg: string; text: string }> = {
  pendiente: { bg: '#FEF3C7', text: '#D97706' },
  aprobado: { bg: '#D1FAE5', text: '#059669' },
  entregado: { bg: '#EDE9FE', text: '#7C3AED' },
  cancelado: { bg: '#FEE2E2', text: '#DC2626' },
};

// Helpers
const getInitials = (name: string) =>
  name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

const formatPrice = (n: number) =>
  '$ ' + Number(n).toLocaleString('es-CO');

const formatDate = (dt: string) => {
  const d = new Date(dt);
  return d.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export default function PedidosListScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filters = ['all', 'pendiente', 'aprobado', 'entregado', 'cancelado'];

  // Filtrar datos
  const filteredData = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return DATA.filter((d) => {
      const matchesFilter = activeFilter === 'all' || d.Estado === activeFilter;
      const matchesSearch =
        !q ||
        d.ClienteNombre.toLowerCase().includes(q) ||
        d.ClienteCorreo.toLowerCase().includes(q) ||
        d.PedidoClienteId.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [searchQuery, activeFilter]);

  const renderCard = ({ item, index }: { item: Pedido; index: number }) => {
    const palette = PAL[index % PAL.length];
    const statusColors = SC[item.Estado];

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
          <Text style={styles.cname} numberOfLines={1}>
            {item.ClienteNombre}
          </Text>
          <View style={styles.ctagRow}>
            <View style={[styles.sbadge, { backgroundColor: statusColors.bg }]}>
              <Text style={[styles.sbadgeText, { color: statusColors.text }]}>
                {SL[item.Estado]}
              </Text>
            </View>
            <View
              style={[
                styles.tipoBadge,
                {
                  backgroundColor:
                    item.TipoCliente === 'registrado' ? '#DBEAFE' : '#FFF7ED',
                },
              ]}
            >
              <Text
                style={[
                  styles.tipoBadgeText,
                  {
                    color: item.TipoCliente === 'registrado' ? '#2563EB' : '#C2410C',
                  },
                ]}
              >
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

      {/* Header */}
      <LinearGradient
        colors={['#1B365D', '#2d4a73']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={18} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pedidos</Text>
        <View style={styles.headerSpacer} />
      </LinearGradient>

      {/* Search + Filters */}
      <View style={styles.searchArea}>
        <View style={styles.searchWrapper}>
          <Ionicons name="search" size={16} color="#7A8BAA" style={styles.sIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por cliente, correo o ID…"
            placeholderTextColor="#7A8BAA"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.clearBtn}
              onPress={() => setSearchQuery('')}
            >
              <Text style={styles.clearBtnText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Filters */}
        <View style={styles.filters}>
          {filters.map((f) => (
            <TouchableOpacity
              key={f}
              style={[
                styles.chip,
                activeFilter === f && styles.chipActive,
              ]}
              onPress={() => setActiveFilter(f)}
            >
              <Text
                style={[
                  styles.chipText,
                  activeFilter === f && styles.chipTextActive,
                ]}
              >
                {f === 'all' ? 'Todos' : SL[f as Pedido['Estado']]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
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
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyText}>Sin resultados para tu búsqueda</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEF1F8',
  },
    header: {
    padding: 22,
    paddingBottom: 35,  
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 28,   
    borderBottomRightRadius: 28,
    overflow: 'hidden'
  },          
  backBtn: {
    width: 38,
    height: 38,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'PlayfairDisplay_600Regular', // Requiere expo-font
    color: '#ffffff',
    fontSize: 21,
  },
  headerSpacer: {
    width: 38,
  },
  searchArea: {
    backgroundColor: '#ffffff',
    padding: 14,
    paddingBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#DDE3EE',
  },
  searchWrapper: {
    position: 'relative',
    marginBottom: 14,
  },
  searchInput: {
    backgroundColor: '#EEF1F8',
    borderWidth: 1.5,
    borderColor: '#DDE3EE',
    borderRadius: 14,
    paddingVertical: 11,
    paddingHorizontal: 42,
    fontSize: 14,
    color: '#1B365D',
  },
  sIcon: {
    position: 'absolute',
    left: 14,
    top: '50%',
    marginTop: -8,
  },
  clearBtn: {
    position: 'absolute',
    right: 12,
    top: '50%',
    marginTop: -11,
    backgroundColor: '#DDE3EE',
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearBtnText: {
    fontSize: 11,
    color: '#7A8BAA',
  },
  filters: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#EEF1F8',
    borderWidth: 1.5,
    borderColor: '#DDE3EE',
  },
  chipActive: {
    backgroundColor: '#1B365D',
    borderColor: '#1B365D',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#7A8BAA',
  },
  chipTextActive: {
    color: '#ffffff',
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    gap: 12,
    shadowColor: '#1B365D',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  avatarText: {
    fontWeight: '700',
    fontSize: 14,
  },
  cbody: {
    flex: 1,
  },
  cname: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1B365D',
    marginBottom: 4,
  },
  ctagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  sbadge: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 7,
  },
  sbadgeText: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  tipoBadge: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 7,
  },
  tipoBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  cdate: {
    fontSize: 11,
    color: '#7A8BAA',
  },
  cright: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  ctotal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1B365D',
  },
  arrowCircle: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: '#EEF1F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    alignItems: 'center',
    padding: 60,
    gap: 10,
  },
  emptyIcon: {
    fontSize: 42,
    opacity: 0.25,
  },
  emptyText: {
    color: '#7A8BAA',
    fontSize: 14,
  },
});