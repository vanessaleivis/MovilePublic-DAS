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

// Tipo
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

// Datos de ejemplo (reemplazar con API call usando el ID)
const getDataById = (id: string): Pedido | undefined => {
  // En producción: fetch desde tu API
  return DATA.find((d) => d.PedidoClienteId === id);
};

const DATA: Pedido[] = [
  // ... mismos datos que en index.tsx
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
  // ... agregar más datos según necesites
];

// Helpers
const SL: Record<Pedido['Estado'], string> = {
  pendiente: 'Pendiente',
  aprobado: 'Aprobado',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
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

export default function PedidoDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const pedido = getDataById(id);

  if (!pedido) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Pedido no encontrado</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1B365D" />

      {/* Header */}
      {/* Header con curva inferior */}
      <LinearGradient
        colors={['#1B365D', '#2d4a73']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.dheader}
      >
        <View style={styles.dhTop}>
          {/*  Izquierda: Botón volver */}
          <TouchableOpacity style={styles.dback} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={18} color="#ffffff" />
          </TouchableOpacity>

          <View style={styles.dhTitleContainer}>
            <Text style={styles.dhTitle}>Detalle Pedido</Text>
          </View>

          {/* ✅ Derecha: Spacer para equilibrar el layout y centrar el título */}
          <View style={{ width: 38 }} />

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
            value={pedido.ClienteNombre}
            badge={{
              text: pedido.TipoCliente === 'registrado' ? 'Registrado' : 'Walk-in',
              bg: pedido.TipoCliente === 'registrado' ? '#DBEAFE' : '#FFF7ED',
              color: pedido.TipoCliente === 'registrado' ? '#2563EB' : '#C2410C',
            }}
          />
          <DetailRow
            iconBg="#DBEAFE"
            iconColor="#2563EB"
            iconName="mail"
            label="Correo"
            value={pedido.ClienteCorreo}
            onPress={() => Linking.openURL(`mailto:${pedido.ClienteCorreo}`)}
          />
          <DetailRow
            iconBg="#D1FAE5"
            iconColor="#059669"
            iconName="call"
            label="Teléfono"
            value={pedido.ClienteTelefono}
            onPress={() => Linking.openURL(`tel:${pedido.ClienteTelefono}`)}
          />
        </View>

        {/* Entrega */}
        <Text style={styles.secTitle}>Datos de entrega</Text>
        <View style={styles.dcard}>
          <DetailRow
            iconBg="#FCE7F3"
            iconColor="#DB2777"
            iconName="person"
            label="Recibe"
            value={pedido.NombreRecibe}
          />
          <DetailRow
            iconBg="#D1FAE5"
            iconColor="#059669"
            iconName="call"
            label="Teléfono entrega"
            value={pedido.TelefonoEntrega}
            onPress={() => Linking.openURL(`tel:${pedido.TelefonoEntrega}`)}
          />
          <DetailRow
            iconBg="#FEF3C7"
            iconColor="#D97706"
            iconName="location"
            label="Dirección"
            value={pedido.DireccionEntrega}
            isMultiline
          />
        </View>

        {/* Pago */}
        <Text style={styles.secTitle}>Pago</Text>
        <View style={styles.dcard}>
          <DetailRow
            iconBg="#DBEAFE"
            iconColor="#2563EB"
            iconName="card"
            label="Método de pago"
            value={pedido.MetodoPago === 'transferencia' ? 'Transferencia' : 'Contra entrega'}
          />
          <View style={styles.drow}>
            <View style={[styles.dicon, { backgroundColor: '#F0FDF4' }]}>
              <Ionicons name="checkmark-circle" size={15} color="#16A34A" />
            </View>
            <View style={styles.dcontent}>
              <Text style={styles.dlabel}>Voucher / Comprobante</Text>
              {pedido.Voucher ? (
                <View style={styles.voucherBox}>
                  <Text style={styles.voucherText}>{pedido.Voucher}</Text>
                </View>
              ) : (
                <Text style={styles.emptyVal}>Sin comprobante</Text>
              )}
            </View>
          </View>
        </View>

        {/* IDs */}
        <Text style={styles.secTitle}>Identificadores del sistema</Text>
        <View style={styles.dcard}>
          <DetailRow
            iconBg="#EEF1F8"
            iconColor="#7A8BAA"
            iconName="barcode"
            label="ID Pedido"
            value={pedido.PedidoClienteId}
            isMono
          />
          <DetailRow
            iconBg="#EEF1F8"
            iconColor="#7A8BAA"
            iconName="barcode"
            label="ID Cliente"
            value={pedido.ClienteId}
            isMono
          />
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

// Componente reutilizable para filas de detalle
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

// Colores de estado para el detalle
const SC: Record<Pedido['Estado'], { bg: string; text: string }> = {
  pendiente: { bg: '#FEF3C7', text: '#D97706' },
  aprobado: { bg: '#D1FAE5', text: '#059669' },
  entregado: { bg: '#EDE9FE', text: '#7C3AED' },
  cancelado: { bg: '#FEE2E2', text: '#DC2626' },
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
  },
  dback: {
    width: 38,
    height: 38,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dhTitleContainer: {
    flex: 1,           // ✅ Ocupa el espacio central
    alignItems: 'center', // ✅ Centra el título
    paddingHorizontal: 12, // ✅ Espacio para que no choque con los extremos
  },
  dhTitle: {
    fontFamily: 'PlayfairDisplay_600Regular',
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  hvalue: {
    fontSize: 20,
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
  emptyVal: {
    color: '#7A8BAA',
    fontStyle: 'italic',
    fontWeight: '400',
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
  voucherBox: {
    backgroundColor: '#EEF1F8',
    borderWidth: 1,
    borderColor: '#DDE3EE',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 7,
    marginTop: 2,
  },
  voucherText: {
    fontSize: 11,
    fontFamily: 'monospace',
    color: '#1B365D',
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