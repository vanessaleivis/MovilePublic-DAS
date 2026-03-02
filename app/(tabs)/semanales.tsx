import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
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
} from 'react-native';
import { Svg, Path, Line, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

const screenWidth = Dimensions.get('window').width;
const CHART_WIDTH = screenWidth - 56;
const CHART_HEIGHT = 90;

type Category = 'productos' | 'servicios';

type Item = {
  icon: string;
  bg: string;
  name: string;
  sub: string;
  amt: string;
  pct: string;
  type: 'green' | 'red';
};

type ChartSet = {
  values: number[];
  labels: string[];
  total: string;
  trend: string;
  trendColor: string;
  trendBg: string;
};

const chartSets: Record<Category, ChartSet> = {
  productos: {
    values: [38, 52, 44, 60, 35, 72, 58, 48, 80, 55, 42, 68],
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    total: '$21,536',
    trend: '↑ 12.4%',
    trendColor: '#15803d',
    trendBg: '#dcfce7',
  },
  servicios: {
    values: [30, 45, 38, 55, 42, 60, 50, 44, 65, 52, 48, 70],
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    total: '$15,570',
    trend: '↑ 18.2%',
    trendColor: '#15803d',
    trendBg: '#dcfce7',
  },
};

const itemsData: Record<Category, Item[]> = {
  productos: [
    { icon: '📚', bg: '#EFF6FF', name: 'Books', sub: '$0 hoy', amt: '$0.00', pct: '↓ 100%', type: 'red' },
    { icon: '🍕', bg: '#FFF7ED', name: 'Food & Drink', sub: '+$2,250 hoy', amt: '$391.25', pct: '↑ 7.8%', type: 'green' },
    { icon: '💻', bg: '#F0FDF4', name: 'Electronics', sub: '+$5,230 hoy', amt: '$3,176.25', pct: '↑ 42.6%', type: 'green' },
    { icon: '🏥', bg: '#FFF1F2', name: 'Health', sub: '+$1,200 hoy', amt: '$890.00', pct: '↓ 26.5%', type: 'red' },
  ],
  servicios: [
    { icon: '☁️', bg: '#EFF6FF', name: 'Cloud Storage', sub: '+$880 hoy', amt: '$2,340.00', pct: '↑ 18.2%', type: 'green' },
    { icon: '🎧', bg: '#F5F3FF', name: 'Streaming', sub: '+$320 hoy', amt: '$980.50', pct: '↑ 5.4%', type: 'green' },
    { icon: '🔧', bg: '#FFF7ED', name: 'Mantenimiento', sub: '$0 hoy', amt: '$450.00', pct: '↓ 12.3%', type: 'red' },
    { icon: '📱', bg: '#F0FDF4', name: 'SaaS Apps', sub: '+$1,100 hoy', amt: '$3,800.00', pct: '↑ 31.0%', type: 'green' },
  ],
};

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

export default function SemanalesScreen() {
  const router = useRouter();
  const [activeCat, setActiveCat] = useState<Category>('productos');
  const [tooltip, setTooltip] = useState<{ visible: boolean; value: string; x?: number; y?: number }>({
    visible: false,
    value: '',
  });

  const currentSet = chartSets[activeCat];
  const currentItems = itemsData[activeCat];

  const handlePointPress = (value: number, label: string, index: number) => {
    const mockAmt = Math.round(value * 295);
    setTooltip({ visible: true, value: `${label}: $${mockAmt.toLocaleString()}` });
    setTimeout(() => setTooltip({ visible: false, value: '' }), 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1B365D" />

      {/* ── HEADER SIMPLE CON Bordes Curvos ── */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color="#ffffff" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Semanal</Text>
            <Text style={styles.headerDate}>Feb 2026</Text>
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
              <Text style={styles.trendBadgeText}>{currentSet.trend}</Text>
            </View>
          </View>
          <Text style={styles.totalAmount}>{currentSet.total}</Text>
          
          {/* Gráfico */}
          <View style={styles.chartWrapper}>
            <AreaChart data={currentSet.values} labels={currentSet.labels} onPointPress={handlePointPress} />
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, activeCat === 'productos' && styles.tabActive]}
              onPress={() => setActiveCat('productos')}
            >
              <Text style={[styles.tabText, activeCat === 'productos' && styles.tabTextActive]}>
                Productos
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeCat === 'servicios' && styles.tabActive]}
              onPress={() => setActiveCat('servicios')}
            >
              <Text style={[styles.tabText, activeCat === 'servicios' && styles.tabTextActive]}>
                Servicios
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Section Title */}
        <Text style={styles.sectionTitle}>
          {activeCat === 'productos' ? 'Productos' : 'Servicios'}
        </Text>

        {/* Items List */}
        <View style={styles.itemsList}>
          {currentItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.item} activeOpacity={0.9}>
              <View style={[styles.itemIcon, { backgroundColor: item.bg }]}>
                <Text style={styles.itemIconText}>{item.icon}</Text>
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
          ))}
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

  /* ── HEADER SIMPLE CON Bordes Curvos ── */
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
  },
  headerCenter: { 
    alignItems: 'center',
    flex: 1,
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
    width: 40 
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

  /* Tabs Container */
  tabsContainer: {
    marginBottom: 20,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#eef2fa',
    borderRadius: 14,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#1B365D',
  },
  tabText: {
    fontSize: 13, 
    fontWeight: '600', 
    color: '#7a8fa6',
  },
  tabTextActive: {
    color: '#fff',
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