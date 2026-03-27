import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { pedidosService } from '../../services/pedidosService';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'ventas' | 'pedidos'>('ventas');
  const [stats, setStats] = useState({ pendingCount: 0, todayCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await pedidosService.getStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Configuración de tarjetas - SOLO 4 tarjetas como original
  const cards = {
    ventas: [
      { id: 'ventas', icon: '🛒', label: 'Ventas', route: '/ventas', color: '#2563EB', bgLight: '#DBEAFE' },
      { id: 'pedidos', icon: '📄', label: 'Pedidos', route: '/pedidos', color: '#059669', bgLight: '#D1FAE5' },
      { id: 'semanal', icon: '📅', label: 'Reporte Semanal', route: '/ventas/semanales', color: '#D97706', bgLight: '#FEF3C7' },
      { id: 'mensual', icon: '📊', label: 'Reporte Mensual', route: '/ventas/mensuales', color: '#7C3AED', bgLight: '#EDE9FE' },
    ],
    pedidos: [
      { id: 'ventas', icon: '🛒', label: 'Ventas', route: '/ventas', color: '#2563EB', bgLight: '#DBEAFE' },
      { id: 'pedidos', icon: '📄', label: 'Pedidos', route: '/pedidos', color: '#059669', bgLight: '#D1FAE5' },
      { id: 'semanal', icon: '📅', label: 'Reporte Semanal', route: '/ventas/semanales', color: '#D97706', bgLight: '#FEF3C7' },
      { id: 'mensual', icon: '📊', label: 'Reporte Mensual', route: '/ventas/mensuales', color: '#7C3AED', bgLight: '#EDE9FE' },
    ],
  };

  const currentCards = cards[activeTab];

  const handleCardPress = (route: string) => {
    router.push(route);
  };

  const handlePendingPress = () => {
    router.push('/pedidos/pendientes');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#e8ecf5" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Top Bar */}
        <View style={styles.topbar}>
          <View style={styles.topbarLeft} />
          <Text style={styles.topbarCenter}>Home</Text>
          <TouchableOpacity style={styles.topbarAvatar}        onPress={() => router.push('/pedidos' as any)}
>
            <Text style={styles.topbarAvatarText}>👤</Text>
          </TouchableOpacity>
        </View>

        {/* Greeting Section */}
        <View style={styles.greetingSection}>
          <Text style={styles.greetingSub}>Buenos días</Text>
          <Text style={styles.greetingName}>Hola, Admin! 👋</Text>
        </View>

        {/* Welcome Card - Pedidos Pendientes */}
        <TouchableOpacity activeOpacity={0.9} onPress={handlePendingPress}>
          <LinearGradient
            colors={['#1B365D', '#476a9b']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.welcomeCard}
          >
            <View style={styles.welcomeCardInner}>
              <View style={styles.wcIcon}>
                <Text style={styles.wcIconText}>⏱</Text>
              </View>
              <View style={styles.wcText}>
                <Text style={styles.wcTitle}>Pedidos pendientes</Text>
                {loading ? (
                  <ActivityIndicator color="white" size="small" style={{ alignSelf: 'flex-start', marginTop: 8 }} />
                ) : (
                  <>
                    <Text style={styles.wcCount}>{stats.pendingCount} pedidos</Text>
                    <Text style={styles.wcSub}>{stats.todayCount} para hoy</Text>
                  </>
                )}
              </View>
            </View>
            {/* Círculos decorativos */}
            <View style={styles.circle1} />
            <View style={styles.circle2} />
          </LinearGradient>
        </TouchableOpacity>

        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Accesos rápidos</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'ventas' && styles.tabActiveVentas]}
            onPress={() => setActiveTab('ventas')}
          >
            <Text style={[styles.tabText, activeTab === 'ventas' && styles.tabTextActive]}>
              Ventas
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'pedidos' && styles.tabActivePedidos]}
            onPress={() => setActiveTab('pedidos')}
          >
            <Text style={[styles.tabText, activeTab === 'pedidos' && styles.tabTextActive]}>
              Pedidos
            </Text>
          </TouchableOpacity>
        </View>

        {/* Cards Grid */}
        <View style={styles.cardsGrid}>
          {currentCards.map((card, index) => {
            const isActive = 
              (activeTab === 'ventas' && card.id === 'ventas') ||
              (activeTab === 'pedidos' && card.id === 'pedidos');
            
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.pcard,
                  activeTab === 'ventas' && card.id === 'ventas' && styles.pcardLitVentas,
                  activeTab === 'pedidos' && card.id === 'pedidos' && styles.pcardLitPedidos,
                ]}
                onPress={() => handleCardPress(card.route)}
                activeOpacity={0.8}
              >
                <View style={[
                  styles.pcardIconWrap,
                  { backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : card.bgLight }
                ]}>
                  <Text style={[styles.pcardIcon, isActive && styles.pcardIconActive]}>
                    {card.icon}
                  </Text>
                </View>
                <Text style={[
                  styles.pcardTitle,
                  isActive && styles.pcardTitleActive
                ]}>
                  {card.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8ecf5',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
  },
  // Top Bar
  topbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 35,
    paddingHorizontal: 22,
  },
  topbarLeft: {
    width: 34,
  },
  topbarCenter: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1b2a6b',
    letterSpacing: 0.5,
  },
  topbarAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#e0e4f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topbarAvatarText: {
    fontSize: 17,
  },
  // Greeting Section
  greetingSection: {
    paddingTop: 22,
    paddingHorizontal: 22,
  },
  greetingSub: {
    fontSize: 13,
    color: '#9ea5c0',
    fontWeight: '600',
    marginBottom: 4,
  },
  greetingName: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1b2a6b',
    lineHeight: 33,
  },
  // Welcome Card
  welcomeCard: {
    marginTop: 20,
    marginHorizontal: 18,
    borderRadius: 22,
    overflow: 'hidden',
    position: 'relative',
  },
  welcomeCardInner: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    zIndex: 2,
  },
  wcIcon: {
    flexShrink: 0,
  },
  wcIconText: {
    fontSize: 38,
  },
  wcText: {
    flex: 1,
  },
  wcTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: 'white',
  },
  wcCount: {
    fontSize: 26,
    fontWeight: '900',
    color: 'white',
    lineHeight: 29,
    marginTop: 4,
  },
  wcSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.55)',
    marginTop: 2,
  },
  circle1: {
    position: 'absolute',
    top: -30,
    right: 40,
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(255,255,255,0.06)',
    zIndex: 1,
  },
  circle2: {
    position: 'absolute',
    bottom: -25,
    right: -10,
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.04)',
    zIndex: 1,
  },
  // Section Header
  sectionHeader: {
    paddingTop: 24,
    paddingHorizontal: 22,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1b2a6b',
  },
  // Tabs
  tabRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 18,
    paddingBottom: 14,
  },
  tabBtn: {
    paddingVertical: 7,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: '#dde3f5',
  },
  tabActiveVentas: {
    backgroundColor: '#1B365D',
  },
  tabActivePedidos: {
    backgroundColor: '#3a6fd8',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#6b7bb5',
  },
  tabTextActive: {
    color: 'white',
  },
  // Cards Grid
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 18,
  },
  pcard: {
    width: (width - 48) / 2,
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: 'white',
    shadowColor: '#1B365D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 3,
  },
  pcardLitVentas: {
    backgroundColor: '#1B365D',
    shadowColor: '#1B365D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 24,
    elevation: 10,
  },
  pcardLitPedidos: {
    backgroundColor: '#3a6fd8',
    shadowColor: '#3a6fd8',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 24,
    elevation: 10,
  },
  pcardIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pcardIcon: {
    fontSize: 24,
  },
  pcardIconActive: {
    color: 'white',
  },
  pcardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1b2a6b',
    textAlign: 'center',
  },
  pcardTitleActive: {
    color: 'white',
  },
});