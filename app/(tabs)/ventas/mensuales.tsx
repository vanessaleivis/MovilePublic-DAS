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
    ActivityIndicator,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { ventasService } from '../../../services/ventasService';

const screenWidth = Dimensions.get('window').width;

export default function MensualesScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const report = await ventasService.getMonthlyReport();
                setData(report);
            } catch (error) {
                console.error('Error fetching monthly report:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, []);


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

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#1B365D" />
                    <Text style={styles.loadingText}>Cargando reporte...</Text>
                </View>
            </SafeAreaView>
        );
    }

    // Map data or use defaults
    const chartData = data?.chartData || {
        labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
        datasets: [
            {
                data: [0, 0, 0, 0],
                color: (opacity = 1) => `rgba(27, 54, 93, ${opacity})`,
                strokeWidth: 2,
            },
            {
                data: [0, 0, 0, 0],
                color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`,
                strokeWidth: 2,
            },
        ],
        legend: ['Ingresos', 'Gastos'],
    };

    const productosData = data?.productos || [];

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
                        <Text style={styles.headerDate}>{data?.periodo || 'periodo'}</Text>
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
                            <Text style={styles.trendBadgeText}>{data?.trend || '0%'}</Text>
                        </View>
                    </View>
                    <Text style={styles.totalAmount}>$ {data?.total?.toLocaleString() || '0'}</Text>
                    
                    {/* Line Chart */}
                    <View style={styles.chartContainer}>
                        <LineChart
                            data={chartData}
                            width={screenWidth - 72}
                            height={140}
                            chartConfig={chartConfig}
                            bezier
                            style={styles.chartStyle}
                            fromZero
                            yAxisSuffix=""
                            segments={3}
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

                {/* Section Title - Productos */}
                <Text style={styles.sectionTitle}>Productos</Text>

                {/* Lista de productos */}
                <View style={styles.itemsList}>
                    {productosData.length > 0 ? productosData.map((item: any, index: number) => (
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
                            <Text style={styles.emptyText}>No hay datos de productos disponibles</Text>
                        </View>
                    )}
                </View>

                <View style={{ height: 80 }} />
            </ScrollView>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f7fa' },
    loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    loadingText: { marginTop: 10, color: '#1B365D', fontWeight: '500' },
    emptyContainer: { padding: 20, alignItems: 'center' },
    emptyText: { color: '#7a8fa6' },


    /* ── HEADER ── */
    header: {
        backgroundColor: '#1B365D',
        paddingTop: 40,
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
    body: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },

    /* Card de Gráfico */
    chartCard: {
        backgroundColor: '#ffffff',
        borderRadius: 24,
        padding: 16,
        marginBottom: 14,
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
        marginBottom: 6,
    },
    chartLabel: {
        fontSize: 10,
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
    trendBadgeText: { fontSize: 11, fontWeight: '700', color: '#15803d' },
    totalAmount: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1B365D',
        letterSpacing: -1,
        marginBottom: 10,
    },
    chartContainer: {
        alignItems: 'center',
        marginVertical: 4,
    },
    chartStyle: { borderRadius: 16 },
    chartFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        marginTop: 8,
        paddingHorizontal: 4,
    },
    legend: { flexDirection: 'row', gap: 16 },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    legendDot: { width: 10, height: 10, borderRadius: 5 },
    legendText: { fontSize: 11, color: '#6b7280', fontWeight: '500' },

    /* Section Title */
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1B365D',
        marginBottom: 12,
        paddingHorizontal: 4,
    },

    /* Items List */
    itemsList: { gap: 10 },
    item: {
        backgroundColor: '#ffffff',
        borderRadius: 18,
        padding: 14,
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
        width: 44,
        height: 44,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    itemIconText: { fontSize: 20 },
    itemInfo: { flex: 1 },
    itemName: { fontSize: 13, fontWeight: '700', color: '#1B365D', letterSpacing: -0.2 },
    itemSub: { fontSize: 11, color: '#7a8fa6', marginTop: 2 },
    itemRight: { alignItems: 'flex-end' },
    itemAmt: { fontSize: 13, fontWeight: '700', color: '#1B365D', letterSpacing: -0.3 },
    pctBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, marginTop: 3 },
    pctBadgeText: { fontSize: 10, fontWeight: '700' },
    greenBadge: { backgroundColor: '#dcfce7' },
    redBadge: { backgroundColor: '#fee2e2' },
    greenBadgeText: { color: '#15803d' },
    redBadgeText: { color: '#b91c1c' },
});