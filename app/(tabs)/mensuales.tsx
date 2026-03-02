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
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

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

// ── Datos Gráfico MENSUAL - Ingresos vs Gastos ──
const chartData = {
    labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
    datasets: [
        {
            data: [15000, 18500, 17200, 21536],
            color: (opacity = 1) => `rgba(27, 54, 93, ${opacity})`,
            strokeWidth: 2,
        },
        {
            data: [8000, 9200, 8500, 10200],
            color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`,
            strokeWidth: 2,
        },
    ],
    legend: ['Ingresos', 'Gastos'],
};

// ── Datos de items ──
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

export default function MensualesScreen() {
    const router = useRouter();
    const [activeCat, setActiveCat] = useState<Category>('productos');
    const currentItems = itemsData[activeCat];

    // Configuración optimizada del gráfico
    const chartConfig = {
        backgroundGradientFrom: '#ffffff',
        backgroundGradientTo: '#ffffff',
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(27, 54, 93, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(122, 143, 166, ${opacity})`,
        style: { borderRadius: 16 },
        propsForDots: { r: '3', strokeWidth: '1.5', stroke: '#1B365D' },
        propsForBackgroundLines: { strokeDasharray: '4 4', stroke: '#e5e7eb' },
        propsForLabels: { fontSize: 10 },
    };

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
                        <Text style={styles.headerTitle}>Mensual</Text>
                        <Text style={styles.headerDate}>Feb 2026</Text>
                    </View>
                    <View style={styles.headerSpacer} />
                </View>
            </View>

            {/* ── BODY ── */}
            <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>

                {/* Gráfico */}
                <View style={styles.chartCard}>
                    <View style={styles.chartHeader}>
                        <Text style={styles.chartLabel}>INGRESOS TOTALES</Text>
                        <View style={styles.trendBadge}>
                            <Text style={styles.trendBadgeText}>↑ 12.4%</Text>
                        </View>
                    </View>
                    <Text style={styles.totalAmount}>$21,536</Text>
                    
                    {/* Line Chart - MÁS PEQUEÑO */}
                    <View style={styles.chartContainer}>
                        <LineChart
                            data={chartData}
                            width={screenWidth - 72}  // ✅ Reducido ancho
                            height={140}                // ✅ Reducido altura (antes 200)
                            chartConfig={chartConfig}
                            bezier
                            style={styles.chartStyle}
                            fromZero
                            yAxisSuffix=""
                            segments={3}                // ✅ Menos líneas de grid
                        />
                    </View>

                    {/* Leyenda */}
                    <View style={styles.chartFooter}>
                        <View style={styles.legend}>
                            <View style={styles.legendItem}>
                                <View style={[styles.legendDot, { backgroundColor: '#1B365D' }]} />
                                <Text style={styles.legendText}>Ingresos</Text>
                            </View>
                            <View style={styles.legendItem}>
                                <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
                                <Text style={styles.legendText}>Gastos</Text>
                            </View>
                        </View>
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

                {/* Lista de items */}
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

                <View style={{ height: 80 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f7fa' },

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
        width: 40, height: 40, borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center', justifyContent: 'center',
    },
    headerCenter: { alignItems: 'center', flex: 1 },
    headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff', letterSpacing: 0.5 },
    headerDate: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
    headerSpacer: { width: 40 },

    /* ── BODY ── */
    body: { flex: 1, paddingHorizontal: 20, paddingTop: 20 }, // ✅ paddingTop reducido

    /* Card de Gráfico */
    chartCard: {
        backgroundColor: '#ffffff',
        borderRadius: 24,
        padding: 16,  // ✅ Reducido de 20 a 16
        marginBottom: 14, // ✅ Reducido
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    chartHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6, // ✅ Reducido
    },
    chartLabel: {
        fontSize: 10, // ✅ Reducido
        fontWeight: '600',
        color: '#7a8fa6',
        letterSpacing: 0.5,
    },
    trendBadge: {
        backgroundColor: '#dcfce7',
        paddingHorizontal: 9,
        paddingVertical: 3,
        borderRadius: 12,
    },
    trendBadgeText: { fontSize: 11, fontWeight: '700', color: '#15803d' }, // ✅ Reducido
    totalAmount: {
        fontSize: 24, // ✅ Reducido de 28 a 24
        fontWeight: '800',
        color: '#1B365D',
        letterSpacing: -1,
        marginBottom: 10, // ✅ Reducido
    },
    chartContainer: {
        alignItems: 'center',
        marginVertical: 4, // ✅ Reducido
    },
    chartStyle: { borderRadius: 16 },
    chartFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        marginTop: 8, // ✅ Reducido
        paddingHorizontal: 4,
    },
    legend: { flexDirection: 'row', gap: 16 }, // ✅ gap reducido
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    legendDot: { width: 10, height: 10, borderRadius: 5 }, // ✅ Reducido
    legendText: { fontSize: 11, color: '#6b7280', fontWeight: '500' }, // ✅ Reducido

    /* Tabs */
    tabsContainer: { marginBottom: 16 }, // ✅ Reducido
    tabs: {
        flexDirection: 'row',
        backgroundColor: '#eef2fa',
        borderRadius: 14,
        padding: 4,
    },
    tab: { flex: 1, paddingVertical: 9, borderRadius: 12, alignItems: 'center' },
    tabActive: { backgroundColor: '#1B365D' },
    tabText: { fontSize: 13, fontWeight: '600', color: '#7a8fa6' },
    tabTextActive: { color: '#fff' },

    /* Section Title */
    sectionTitle: {
        fontSize: 14, // ✅ Reducido
        fontWeight: '700',
        color: '#1B365D',
        marginBottom: 12,
        paddingHorizontal: 4,
    },

    /* Items List */
    itemsList: { gap: 10 }, // ✅ Reducido
    item: {
        backgroundColor: '#ffffff',
        borderRadius: 18,
        padding: 14, // ✅ Reducido
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    itemIcon: {
        width: 44, // ✅ Reducido
        height: 44,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    itemIconText: { fontSize: 20 }, //  Reducido
    itemInfo: { flex: 1 },
    itemName: { fontSize: 13, fontWeight: '700', color: '#1B365D', letterSpacing: -0.2 }, // ✅ Reducido
    itemSub: { fontSize: 11, color: '#7a8fa6', marginTop: 2 },
    itemRight: { alignItems: 'flex-end' },
    itemAmt: { fontSize: 13, fontWeight: '700', color: '#1B365D', letterSpacing: -0.3 }, // ✅ Reducido
    pctBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, marginTop: 3 },
    pctBadgeText: { fontSize: 10, fontWeight: '700' },
    greenBadge: { backgroundColor: '#dcfce7' },
    redBadge: { backgroundColor: '#fee2e2' },
    greenBadgeText: { color: '#15803d' },
    redBadgeText: { color: '#b91c1c' },
});