// ventas/[id].tsx
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  Linking,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// 🔹 Tipo
type Venta = {
  VentaId: string;
  Origen: 'pedido' | 'manual';
  PedidoClienteId: string | null;
  ClienteId: string;
  ClienteNombre: string;
  ClienteTelefono: string;
  ClienteCorreo: string;
  UsuarioVendedorId: string;
  FechaVenta: string;
  Subtotal: number;
  IVA: number;
  Total: number;
  Estado: 'pagado' | 'anulado';
};

// 🔹 Datos de ejemplo (reemplazar con API call usando el ID)
const DATA: Venta[] = [
  {
    VentaId: 'v1a2b3c4-d501-4e5f-8a9b-0c1d2e3f4a01',
    Origen: 'pedido',
    PedidoClienteId: 'f3a1b2c3-d401-4e5f-8a9b-0c1d2e3f4a01',
    ClienteId: 'c1-0001',
    ClienteNombre: 'Empresas S.A.S',
    ClienteTelefono: '+57 601 555 0001',
    ClienteCorreo: 'empresassas@gmail.com',
    UsuarioVendedorId: 'u-001',
    FechaVenta: '2025-04-21T10:32:00',
    Subtotal: 407563.03,
    IVA: 77436.97,
    Total: 485000,
    Estado: 'pagado',
  },
];

const getDataById = (id: string): Venta | undefined => {
  // En producción: fetch desde tu API
  return DATA.find((d) => d.VentaId === id);
};

// 🔹 Helpers
const SL: Record<Venta['Estado'], string> = {
  pagado: 'Pagado',
  anulado: 'Anulado',
};

const OR: Record<Venta['Origen'], string> = {
  pedido: 'Desde Pedido',
  manual: 'Manual',
};

const formatPrice = (n: number) =>
  '$ ' + Number(n).toLocaleString('es-CO');

const formatDateFull = (dt: string) => {
  const d = new Date(dt);
  return `${d.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })} • ${d.toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
  })}`;
};

export default function VentaDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const venta = getDataById(id);

  if (!venta) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Venta no encontrada</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const statusColors = SC[venta.Estado];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1B365D" />

      {/* Header con curva inferior */}
      <LinearGradient
        colors={['#1B365D', '#2d4a73']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.dheader}
      >
        <View style={styles.dhTop}>
          {/* Botón volver */}
          <TouchableOpacity style={styles.dback} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={18} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Body */}
      <ScrollView style={styles.dbody} showsVerticalScrollIndicator={false}>
        
        {/* Cliente */}
        <Text style={styles.secTitle}>Información del cliente</Text>
        <View style={styles.dcard}>
          <DetailRow
            iconBg="#EDE9FE"
            iconColor="#7C3AED"
            iconName="person"
            label="Nombre cliente"
            value={venta.ClienteNombre}
          />
          <DetailRow
            iconBg="#DBEAFE"
            iconColor="#2563EB"
            iconName="mail"
            label="Correo"
            value={venta.ClienteCorreo}
            onPress={() => Linking.openURL(`mailto:${venta.ClienteCorreo}`)}
          />
          <DetailRow
            iconBg="#D1FAE5"
            iconColor="#059669"
            iconName="call"
            label="Teléfono"
            value={venta.ClienteTelefono}
            onPress={() => Linking.openURL(`tel:${venta.ClienteTelefono}`)}
          />
        </View>

        {/* Origen y Vendedor */}
        <Text style={styles.secTitle}>Origen y vendedor</Text>
        <View style={styles.dcard}>
          <DetailRow
            iconBg="#FEF3C7"
            iconColor="#D97706"
            iconName="git-branch"
            label="Origen"
            value={OR[venta.Origen]}
            badge={{
              text: OR[venta.Origen],
              bg: venta.Origen === 'pedido' ? '#DBEAFE' : '#FFF7ED',
              color: venta.Origen === 'pedido' ? '#2563EB' : '#C2410C',
            }}
          />
          {venta.PedidoClienteId && (
            <DetailRow
              iconBg="#EEF1F8"
              iconColor="#7A8BAA"
              iconName="link"
              label="Pedido relacionado"
              value={venta.PedidoClienteId}
              isMono
            />
          )}
          <DetailRow
            iconBg="#FCE7F3"
            iconColor="#DB2777"
            iconName="people"
            label="Vendedor ID"
            value={venta.UsuarioVendedorId}
            isMono
          />
        </View>

        {/* Fechas */}
        <Text style={styles.secTitle}>Fecha</Text>
        <View style={styles.dcard}>
          <DetailRow
            iconBg="#E0F2FE"
            iconColor="#0369A1"
            iconName="calendar"
            label="Fecha de venta"
            value={formatDateFull(venta.FechaVenta)}
            isMultiline
          />
        </View>

        {/* Desglose económico */}
        <Text style={styles.secTitle}>Desglose económico</Text>
        <View style={styles.dcard}>
          <DetailRow
            iconBg="#DBEAFE"
            iconColor="#2563EB"
            iconName="receipt"
            label="Subtotal"
            value={formatPrice(venta.Subtotal)}
          />
          <DetailRow
            iconBg="#DBEAFE"
            iconColor="#2563EB"
            iconName="percent"
            label="IVA (19%)"
            value={formatPrice(venta.IVA)}
          />
          <View style={[styles.drow, styles.totalRow]}>
            <View style={[styles.dicon, { backgroundColor: '#D1FAE5' }]}>
              <Ionicons name="cash" size={15} color="#059669" />
            </View>
            <View style={styles.dcontent}>
              <Text style={[styles.dlabel, { color: '#059669' }]}>Total</Text>
              <Text style={[styles.dvalue, { color: '#059669', fontSize: 16, fontWeight: '700' }]}>
                {formatPrice(venta.Total)}
              </Text>
            </View>
          </View>
        </View>

        {/* IDs del sistema */}
        <Text style={styles.secTitle}>Identificadores del sistema</Text>
        <View style={styles.dcard}>
          <DetailRow
            iconBg="#EEF1F8"
            iconColor="#7A8BAA"
            iconName="barcode"
            label="ID Venta"
            value={venta.VentaId}
            isMono
          />
          <DetailRow
            iconBg="#EEF1F8"
            iconColor="#7A8BAA"
            iconName="barcode"
            label="ID Cliente"
            value={venta.ClienteId}
            isMono
          />
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

// 🔹 Componente reutilizable para filas de detalle
function DetailRow({
  iconBg,
  iconColor,
  iconName,
  label,
  value,
  badge,
  onPress,
  isMultiline = false,
  isMono = false,
}: {
  iconBg: string;
  iconColor: string;
  iconName: string;
  label: string;
  value: string;
  badge?: { text: string; bg: string; color: string };
  onPress?: () => void;
  isMultiline?: boolean;
  isMono?: boolean;
}) {
  const Content = (
    <>
      <Text style={styles.dlabel}>{label}</Text>
      <Text style={[styles.dvalue, isMono && styles.dvalueMono, isMultiline && styles.dvalueMultiline]}>
        {value}
      </Text>
      {badge && (
        <View style={[styles.tbadge, { backgroundColor: badge.bg }]}>
          <Text style={[styles.tbadgeText, { color: badge.color }]}>{badge.text}</Text>
        </View>
      )}
    </>
  );

  return (
    <TouchableOpacity style={styles.drow} onPress={onPress} disabled={!onPress}>
      <View style={[styles.dicon, { backgroundColor: iconBg }]}>
        <Ionicons name={iconName as any} size={15} color={iconColor} />
      </View>
      <View style={styles.dcontent}>{Content}</View>
    </TouchableOpacity>
  );
}

// 🔹 Colores de estado para el detalle
const SC: Record<Venta['Estado'], { bg: string; text: string }> = {
  pagado: { bg: '#D1FAE5', text: '#059669' },
  anulado: { bg: '#FEE2E2', text: '#DC2626' },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEF1F8',
  },
  dheader: {
    padding: 22,
    paddingBottom: 35,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
  },
  dhTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dback: {
    width: 38,
    height: 38,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dhBottom: {
    alignItems: 'center',
    marginTop: 16,
  },
  dhTitle: {
    fontFamily: 'PlayfairDisplay_600Regular',
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  hvalue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
  },
  // Body
  dbody: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  secTitle: {
    fontSize: 10,
    fontWeight: '600',
    color: '#7A8BAA',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginVertical: 8,
  },
  dcard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#1B365D',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  drow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 11,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#DDE3EE',
  },
  totalRow: {
    borderBottomWidth: 0,
    backgroundColor: '#F8FAFC',
  },
  dicon: {
    width: 32,
    height: 32,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dcontent: {
    flex: 1,
  },
  dlabel: {
    fontSize: 10,
    color: '#7A8BAA',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  dvalue: {
    fontSize: 14,
    color: '#1B365D',
    fontWeight: '500',
  },
  dvalueMono: {
    fontSize: 11,
    fontFamily: 'monospace',
    color: '#7A8BAA',
    fontWeight: '400',
  },
  dvalueMultiline: {
    lineHeight: 20,
  },
  tbadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  tbadgeText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  bottomSpacer: {
    height: 30,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 60,
    gap: 10,
  },
  emptyText: {
    color: '#7A8BAA',
    fontSize: 14,
  },
  backButton: {
    backgroundColor: '#1B365D',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  backButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});