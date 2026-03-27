import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  Linking,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { Pedido, pedidosService } from '../../services/pedidosService';


// Helpers
const formatPrice = (n: number) =>
  '$ ' + Number(n).toLocaleString('es-CO');

const formatDateFull = (dt: string | undefined) => {
  if (!dt) return '';
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
  const [voucherExpanded, setVoucherExpanded] = useState(false);
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchPedido = async () => {
      try {
        const data = await pedidosService.getPedidoById(id);
        setPedido(data);
      } catch (err: any) {
        setError(err.message || 'Error al cargar el pedido');
      } finally {
        setLoading(false);
      }
    };
    fetchPedido();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.empty}>
          <ActivityIndicator size="large" color="#1B365D" />
          <Text style={styles.emptyText}>Cargando pedido...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !pedido) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>{error || 'Pedido no encontrado'}</Text>
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

      {/* Header - SIN ESTADO */}
      <LinearGradient
        colors={['#1B365D', '#2d4a73']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.dheader}
      >
        <View style={styles.dhTop}>
          <TouchableOpacity style={styles.dback} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color="#ffffff" />
          </TouchableOpacity>
          <View style={styles.dhTitleContainer}>
            <Text style={styles.dhTitle}>Detalle Pedido</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>
      </LinearGradient>

      {/* Body */}
      <ScrollView style={styles.dbody} showsVerticalScrollIndicator={false}>

        {/* Voucher Desplegable */}
        <TouchableOpacity 
          style={styles.voucherHeader}
          onPress={() => setVoucherExpanded(!voucherExpanded)}
          activeOpacity={0.8}
        >
          <View style={styles.voucherHeaderLeft}>
            <Ionicons name="document-text-outline" size={20} color="#1B365D" />
            <Text style={styles.voucherTitle}>Comprobante de pago</Text>
          </View>
          <Ionicons 
            name={voucherExpanded ? "chevron-up" : "chevron-down"} 
            size={20} 
            color="#1B365D" 
          />
        </TouchableOpacity>
        
        {voucherExpanded && (
          <View style={styles.voucherContent}>
            {pedido.Voucher ? (
              <>
                <View style={styles.voucherRow}>
                  <Text style={styles.voucherLabel}>Número de comprobante:</Text>
                  <Text style={styles.voucherValue}>{pedido.Voucher}</Text>
                </View>
                <View style={styles.voucherRow}>
                  <Text style={styles.voucherLabel}>Método de pago:</Text>
                  <Text style={styles.voucherValue}>
                    {pedido.MetodoPago === 'transferencia' ? 'Transferencia bancaria' : 'Contra entrega'}
                  </Text>
                </View>
                <View style={styles.voucherRow}>
                  <Text style={styles.voucherLabel}>Fecha:</Text>
                  <Text style={styles.voucherValue}>{formatDateFull(pedido.FechaPedido)}</Text>

                </View>
                <View style={styles.voucherRow}>
                  <Text style={styles.voucherLabel}>Monto:</Text>
                  <Text style={styles.voucherValue}>{formatPrice(pedido.Total)}</Text>
                </View>
                <View style={styles.voucherDivider} />
                <Text style={styles.voucherNote}>
                  Este comprobante es válido como soporte de pago. Conserve para cualquier reclamo.
                </Text>
              </>
            ) : (
              <View style={styles.noVoucherContainer}>
                <Ionicons name="alert-circle-outline" size={32} color="#7A8BAA" />
                <Text style={styles.noVoucherText}>No hay comprobante disponible</Text>
                <Text style={styles.noVoucherSubtext}>
                  El pago se realizará contra entrega
                </Text>
              </View>
            )}
          </View>
        )}

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEF1F8',
  },
  dheader: {
    padding: 22,
    paddingBottom: 28,
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
    marginTop: 20, // 👈 AGREGADO: marginTop al botón de devolver
  },
  dhTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  dhTitle: {
    fontFamily: 'PlayfairDisplay_600Regular',
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20, // 👈 AGREGADO: marginTop al título
  },
  headerSpacer: {
    width: 38,
    marginTop: 20, // 👈 AGREGADO: para mantener simetría
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
    marginTop: 12,
    marginBottom: 8,
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
  // Voucher desplegable
  voucherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#1B365D',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  voucherHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  voucherTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1B365D',
  },
  voucherContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#1B365D',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  voucherRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  voucherLabel: {
    fontSize: 12,
    color: '#7A8BAA',
    fontWeight: '500',
  },
  voucherValue: {
    fontSize: 13,
    color: '#1B365D',
    fontWeight: '600',
  },
  voucherDivider: {
    height: 1,
    backgroundColor: '#DDE3EE',
    marginVertical: 12,
  },
  voucherNote: {
    fontSize: 11,
    color: '#7A8BAA',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  noVoucherContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  noVoucherText: {
    fontSize: 14,
    color: '#7A8BAA',
    fontWeight: '500',
  },
  noVoucherSubtext: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  drow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
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