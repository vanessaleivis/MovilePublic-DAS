import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";

const CARDS = [
  { id: "Ventas",    icon: "🛒", label: "Ventas",     sub: "Ver ventas", iconBg: "#DBEAFE", activeBg: "#2563EB" },
  { id: "Pedidos",   icon: "📄", label: "Pedidos",    sub: "Gestionar",  iconBg: "#EDE9FE", activeBg: "#1B365D" },
  { id: "Semanales", icon: "📅", label: "Semanales",  sub: "Reporte",    iconBg: "#FCE7F3", activeBg: null },
  { id: "Mensuales", icon: "📊", label: "Mensuales",  sub: "Reporte",    iconBg: "#D1FAE5", activeBg: null },
];

export default function HomeScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Ventas");

  const handleCardPress = (cardId: string) => {
    const routes: Record<string, string> = {
      Ventas: "/ventas",
      Pedidos: "/pedidos",
      Semanales: "/semanales",
      Mensuales: "/mensuales",
    };
    
    const route = routes[cardId];
    
    if (!route) {
      Alert.alert("Error", `No hay ruta configurada para ${cardId}`);
      return;
    }
    
    try {
      router.push(route);
    } catch (error) {
      Alert.alert("Error de navegación", String(error));
    }
  };

  const handlePendingPress = () => {
    router.push('/pedidos/pendientes');
  };

  return (
    <View style={styles.root}>
      <ScrollView 
        style={styles.phone}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── HEADER ─ */}
        <View style={styles.header}>
          <View style={styles.circle1} />
          <View style={styles.circle2} />

          <View style={styles.headerRow}>
            <View style={styles.brand}>
              <View style={styles.brandTextContainer}>
                <Text style={styles.brandName}>Publicidad DAS</Text>
                <Text style={styles.brandSub}>DASHBOARD</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.profileBtn}
              onPress={() => router.push('/perfil')}
            >
              <Text style={styles.profileIcon}>👤</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.greeting}>
            <Text style={styles.greetHello}>Hola,👋</Text>
            <Text style={styles.greetDate}>Mar, 25 Febrero</Text>
          </View>
        </View>

        {/* ── PENDING CARD (DISEÑO ORIGINAL) ── */}
        <TouchableOpacity 
          style={styles.pendingCard}
          activeOpacity={0.9}
          onPress={handlePendingPress}
        >
          <View style={styles.pendingLeft}>
            <Text style={{ fontSize: 24 }}>⏱</Text>
          </View>
          <View style={styles.pendingBody}>
            <Text style={styles.pendingLabel}>Pedidos pendientes</Text>
            <Text style={styles.pendingNum}>8 pedidos</Text>
            <View style={styles.badge}>
              <View style={styles.badgeDot} />
              <Text style={styles.badgeText}>3 para hoy</Text>
            </View>
          </View>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>

        {/* ── SECTION TITLE ── */}
        <Text style={styles.secTitle}>ACCESOS RÁPIDOS</Text>

        {/* ── TABS ── */}
        <View style={styles.tabRow}>
          {["Ventas", "Pedidos"].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={activeTab === tab ? styles.tabActive : styles.tabInactive}
            >
              <Text style={activeTab === tab ? styles.tabActiveText : styles.tabInactiveText}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── GRID 2x2 ── */}
        <View style={styles.grid}>
          {CARDS.map((item) => {
            const isActive = activeTab === item.id;
            
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleCardPress(item.id)}
                activeOpacity={0.8}
                style={[
                  styles.card,
                  isActive && item.activeBg && { backgroundColor: item.activeBg },
                  isActive && styles.cardActive,
                ]}
              >
                <View
                  style={[
                    styles.cardIcon,
                    { backgroundColor: isActive ? "rgba(255,255,255,0.18)" : item.iconBg },
                  ]}
                >
                  <Text style={styles.cardIconText}>{item.icon}</Text>
                </View>
                <Text
                  style={[
                    styles.cardLabel,
                    isActive && styles.cardLabelActive,
                  ]}
                >
                  {item.label}
                </Text>
                <Text
                  style={[
                    styles.cardSub,
                    isActive && styles.cardSubActive,
                  ]}
                >
                  {item.sub}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={{ height: 28 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#E8ECF8",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  phone: {
    flex: 1,
    width: "100%",
    maxWidth: 340,
    backgroundColor: "#F0F4FF",
    borderRadius: 44,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: "#1B365D",
    paddingTop: 56,
    paddingBottom: 24,
    paddingHorizontal: 20,
    position: "relative",
    overflow: "hidden",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  circle1: {
    position: "absolute",
    right: -40,
    top: -50,
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  circle2: {
    position: "absolute",
    right: 25,
    top: 15,
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  brandTextContainer: {
    alignItems: "flex-start",
  },
  brandName: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.5,
    textAlign: "left",
  },
  brandSub: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 8,
    letterSpacing: 1.5,
    marginTop: 2,
    textAlign: "left",
  },
  profileBtn: {
    width: 36,
    height: 36,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  profileIcon: {
    fontSize: 17,
  },
  greeting: {
    alignItems: "flex-start",
    paddingLeft: 2,
  },
  greetHello: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 2,
    textAlign: "left",
  },
  greetDate: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 10,
    textAlign: "left",
  },

  // 🔷 PENDING CARD - DISEÑO ORIGINAL (sin cambios)
  pendingCard: {
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 12,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: "#1B365D",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  pendingLeft: {
    width: 46,
    height: 46,
    backgroundColor: "#2563EB",
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  pendingBody: {
    flex: 1,
  },
  pendingLabel: {
    fontSize: 10,
    color: "#7A8BAA",
    marginBottom: 2,
  },
  pendingNum: {
    fontSize: 19,
    fontWeight: "800",
    color: "#1B365D",
    marginBottom: 4,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#EFF6FF",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  badgeDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#2563EB",
  },
  badgeText: {
    fontSize: 9,
    color: "#2563EB",
    fontWeight: "600",
  },
  arrow: {
    color: "#7A8BAA",
    fontSize: 17,
  },

  // ── RESTO DE ESTILOS ──
  secTitle: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 6,
    fontSize: 9,
    color: "#7A8BAA",
    fontWeight: "700",
    letterSpacing: 1,
  },
  tabRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  tabActive: {
    backgroundColor: "#1B365D",
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  tabInactive: {
    backgroundColor: "#E8ECF5",
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  tabActiveText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
  tabInactiveText: {
    color: "#7A8BAA",
    fontSize: 11,
    fontWeight: "600",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    paddingHorizontal: 20,
  },
  card: {
    width: "48%",
    height: 110,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  cardActive: {
    shadowColor: "#1B365D",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 24,
    elevation: 10,
    transform: [{ scale: 1.02 }],
  },
  cardIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  cardIconText: {
    fontSize: 20,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 2,
    color: "#1B365D",
    textAlign: "center",
  },
  cardLabelActive: {
    color: "#fff",
  },
  cardSub: {
    fontSize: 9,
    textAlign: "center",
    color: "#7A8BAA",
    lineHeight: 13,
    paddingHorizontal: 4,
  },
  cardSubActive: {
    color: "rgba(255,255,255,0.6)",
  },
}); 