import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Svg, Path, Line, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { ventasService } from '../../../services/ventasService';

const screenWidth = Dimensions.get('window').width;
const CHART_WIDTH = screenWidth - 56;
const CHART_HEIGHT = 90;

export default function SemanalesScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [tooltip, setTooltip] = useState<{ visible: boolean; value: string; x?: number; y?: number }>({
    visible: false,
    value: '',
  });

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const report = await ventasService.getWeeklyReport();
        setData(report);
      } catch (error) {
        console.error('Error fetching weekly report:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);


function smoothPath(pts: [number, number][], width: number, height: number): string {
  if (pts.length === 0) return '';
  let d = `M ${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1];
    const curr = pts[i];
    const cpX = ((prev[0] + curr[0]) / 2).toFixed(1);
    d += ` C ${cpX},${prev[1].toFixed(1)} ${cpX},${curr[1].toFixed(1)} ${curr[0].toFixed(1)},${curr[1].toFixed(1)}`;
  }
  return d;
}

function AreaChart({ data, labels, onPointPress }: {
  data: number[];
  labels: string[];
  onPointPress: (value: number, label: string, index: number) => void;
}) {
  const W = CHART_WIDTH;
  const H = CHART_HEIGHT;
  const padT = 8;
  const padB = 6;
  
  const minV = Math.min(...data);
  const maxV = Math.max(...data);
  const range = maxV - minV || 1;
  
  const toY = (v: number) => H - padB - ((v - minV) / range) * (H - padT - padB);
  const toX = (i: number) => (i / (data.length - 1)) * W;
  
  const pts: [number, number][] = data.map((v, i) => [toX(i), toY(v)]);
  const linePath = smoothPath(pts, W, H);
  const areaPath = `${linePath} L ${toX(data.length - 1)},${H} L 0,${H} Z`;
  
  const g1 = minV + range * 0.33;
  const g2 = minV + range * 0.66;
  const visibleLabels = labels.map((lbl, i) => i % 2 === 0 ? lbl : '');

  return (
    <View style={styles.areaChartContainer}>
      <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <Defs>
          <LinearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#1B365D" stopOpacity="0.18" />
            <Stop offset="100%" stopColor="#1B365D" stopOpacity="0.01" />
          </LinearGradient>
          <LinearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%" stopColor="#7AADFF" />
            <Stop offset="50%" stopColor="#2255A4" />
            <Stop offset="100%" stopColor="#1B365D" />
          </LinearGradient>
        </Defs>

        <Line x1="0" y1={toY(g1)} x2={W} y2={toY(g1)} stroke="#dde7f5" strokeWidth={1} strokeDasharray="3 3" />
        <Line x1="0" y1={toY(g2)} x2={W} y2={toY(g2)} stroke="#dde7f5" strokeWidth={1} strokeDasharray="3 3" />
        <Path d={areaPath} fill="url(#areaGrad)" />
        <Path d={linePath} fill="none" stroke="url(#lineGrad)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

        {pts.map((p, i) => (
          <Circle key={i} cx={p[0]} cy={p[1]} r={12} fill="transparent" onPress={() => onPointPress(data[i], labels[i], i)} />
        ))}

        {(() => {
          const peakIdx = data.indexOf(maxV);
          const peakPt = pts[peakIdx];
          return (
            <>
              <Circle cx={peakPt[0]} cy={peakPt[1]} r={5} fill="#1B365D" stroke="#fff" strokeWidth={2.5} />
              <Circle cx={peakPt[0]} cy={peakPt[1]} r={9} fill="none" stroke="#1B365D" strokeWidth={1} strokeOpacity={0.25} />
            </>
          );
        })()}
      </Svg>

      <View style={styles.areaLabels}>
        {visibleLabels.map((lbl, i) => (
          <Text key={i} style={styles.areaXLabel}>{lbl}</Text>
        ))}
      </View>
    </View>
  );
}

// (Main component continue here)
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1B365D" />
          <Text style={styles.loadingText}>Cargando reporte semanal...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const chartData = data?.chartData || {
    values: [0, 0, 0, 0, 0, 0, 0],
    labels: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'],
    total: '$0',
    trend: '0%',
  };

  const itemsData = data?.productos || [];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1B365D" />

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color="#ffffff" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Semanal</Text>
            <Text style={styles.headerDate}>{data?.periodo || 'periodo'}</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>
      </View>

      {/* ── BODY ── */}
      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        {/* Card de Ingresos Totales */}
        <View style={styles.totalCard}>
          <View style={styles.totalCardHeader}>
            <Text style={styles.totalCardLabel}>INGRESOS TOTALES</Text>
            <View style={styles.trendBadge}>
              <Text style={styles.trendBadgeText}>{chartData.trend}</Text>
            </View>
          </View>
          <Text style={styles.totalAmount}>{chartData.total}</Text>
          
          {/* Gráfico */}
          <View style={styles.chartWrapper}>
            <AreaChart data={chartData.values} labels={chartData.labels} onPointPress={handlePointPress} />
          </View>
        </View>

        {/* Section Title - Solo Productos */}
        <Text style={styles.sectionTitle}>Productos</Text>

        {/* Items List */}
        <View style={styles.itemsList}>
          {itemsData.length > 0 ? itemsData.map((item: any, index: number) => (
            <TouchableOpacity key={index} style={styles.item} activeOpacity={0.9}>
              <View style={[styles.itemIcon, { backgroundColor: item.bg || '#eee' }]}>
                <Text style={styles.itemIconText}>{item.icon || '📦'}</Text>
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemSub}>{item.sub}</Text>
              </View>
              <View style={styles.itemRight}>
                <Text style={styles.itemAmt}>{item.amt}</Text>
                <View style={[styles.pctBadge, item.type === 'green' ? styles.greenBadge : styles.redBadge]}>
                  <Text style={[styles.pctBadgeText, item.type === 'green' ? styles.greenBadgeText : styles.redBadgeText]}>
                    {item.pct}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )) : (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No hay productos registrados esta semana</Text>
            </View>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>


      {/* Tooltip Modal */}
      <Modal transparent visible={tooltip.visible} animationType="fade" onRequestClose={() => setTooltip({ visible: false, value: '' })}>
        <View style={styles.tooltipOverlay}>
          <View style={styles.tooltip}>
            <Text style={styles.tooltipText}>{tooltip.value}</Text>
            <View style={styles.tooltipArrow} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f5f7fa' 
  },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { marginTop: 10, color: '#1B365D', fontWeight: '500' },
  emptyContainer: { padding: 20, alignItems: 'center' },
  emptyText: { color: '#7a8fa6' },


  /* ── HEADER ── */
  header: {
    backgroundColor: '#1B365D',
    paddingTop: 16,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 40, 
    height: 40, 
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)', 
    alignItems: 'center', 
    justifyContent: 'center',
    marginTop: 20,
  },
  headerCenter: { 
    alignItems: 'center',
    flex: 1,
    marginTop: 20,
  },
  headerTitle: { 
    fontSize: 20, 
    fontWeight: '700', 
    color: '#fff',
    letterSpacing: 0.5,
  },
  headerDate: { 
    fontSize: 12, 
    color: 'rgba(255,255,255,0.7)', 
    marginTop: 2,
  },
  headerSpacer: { 
    width: 40,
    marginTop: 20,
  },

  /* ── BODY ── */
  body: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  /* Card de Total */
  totalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  totalCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalCardLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#7a8fa6',
    letterSpacing: 0.5,
  },
  trendBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trendBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#15803d',
  },
  totalAmount: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1B365D',
    letterSpacing: -1,
    marginBottom: 16,
  },
  chartWrapper: {
    marginTop: 8,
  },

  /* Section Title */
  sectionTitle: { 
    fontSize: 15, 
    fontWeight: '700', 
    color: '#1B365D',
    marginBottom: 14,
    paddingHorizontal: 4,
  },

  /* Items List */
  itemsList: { 
    gap: 12 
  },
  item: {
    backgroundColor: '#ffffff',
    borderRadius: 18, 
    padding: 16,
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  itemIcon: { 
    width: 48, 
    height: 48, 
    borderRadius: 14,
    alignItems: 'center', 
    justifyContent: 'center', 
    flexShrink: 0,
  },
  itemIconText: { 
    fontSize: 22 
  },
  itemInfo: { 
    flex: 1 
  },
  itemName: { 
    fontSize: 14, 
    fontWeight: '700', 
    color: '#1B365D',
    letterSpacing: -0.2,
  },
  itemSub: { 
    fontSize: 12, 
    color: '#7a8fa6', 
    marginTop: 3,
  },
  itemRight: { 
    alignItems: 'flex-end' 
  },
  itemAmt: { 
    fontSize: 14, 
    fontWeight: '700', 
    color: '#1B365D',
    letterSpacing: -0.3,
  },
  pctBadge: { 
    paddingHorizontal: 9, 
    paddingVertical: 3,
    borderRadius: 8, 
    marginTop: 4,
  },
  pctBadgeText: { 
    fontSize: 11, 
    fontWeight: '700',
  },
  greenBadge: { 
    backgroundColor: '#dcfce7' 
  },
  redBadge: { 
    backgroundColor: '#fee2e2' 
  },
  greenBadgeText: { 
    color: '#15803d' 
  },
  redBadgeText: { 
    color: '#b91c1c' 
  },

  /* Area Chart */
  areaChartContainer: { 
    alignItems: 'center',
    marginTop: 8,
  },
  areaLabels: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: '100%', 
    paddingHorizontal: 2, 
    marginTop: 8,
  },
  areaXLabel: { 
    fontSize: 10, 
    color: '#aab8c8', 
    flex: 1, 
    textAlign: 'center',
  },

  /* Tooltip */
  tooltipOverlay: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.4)' 
  },
  tooltip: { 
    backgroundColor: '#1B365D', 
    paddingHorizontal: 12, 
    paddingVertical: 7, 
    borderRadius: 10, 
    alignItems: 'center', 
    position: 'relative' 
  },
  tooltipText: { 
    color: '#fff', 
    fontSize: 12, 
    fontWeight: '600',
  },
  tooltipArrow: {
    position: 'absolute', 
    bottom: -5, 
    width: 0, 
    height: 0,
    borderLeftWidth: 5, 
    borderRightWidth: 5, 
    borderBottomWidth: 5,
    borderLeftColor: 'transparent', 
    borderRightColor: 'transparent', 
    borderTopColor: '#1B365D',
  },
});