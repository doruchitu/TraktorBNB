import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebase";
import api from "../../services/api";
import { COLORS, SPACING, RADIUS } from "../../constants/theme";
import BackButton from "../../components/BackButton";

export default function Profil() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ utilajePostate: 0, rezervariFacute: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProfil = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const [meRes, machineryRes, bookingsRes] = await Promise.all([
        api.get("/users/me", { headers }),
        api.get("/machinery/"),
        api.get("/bookings/my", { headers }),
      ]);

      setUser(meRes.data);

      const utilajeProprii = machineryRes.data.filter(
        (u) => u.owner?.email === meRes.data.email
      );

      setStats({
        utilajePostate: utilajeProprii.length,
        rezervariFacute: bookingsRes.data.length,
      });
    } catch (err) {
      Alert.alert("Eroare", "Nu am putut încărca profilul.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchProfil();
  }, [fetchProfil]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProfil();
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem("token");
      router.replace("/landing");
    } catch (err) {
      Alert.alert("Eroare", "Nu am putut ieși din cont.");
    }
  };

  if (loading) {
    return (
      <View style={styles.centerBox}>
        <ActivityIndicator size="large" color={COLORS.darkGreen} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.flex}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.headerRow}>
        <BackButton color={COLORS.textDark} />
        <Text style={styles.title}>👤 Profil</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.container}>
        <View style={styles.avatarBox}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitials}>
              {user?.nume?.[0]}
              {user?.prenume?.[0]}
            </Text>
          </View>
          <Text style={styles.userName}>
            {user?.nume} {user?.prenume}
          </Text>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>📧 Email</Text>
            <Text style={styles.infoValue}>{user?.email}</Text>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>📞 Telefon</Text>
            <Text style={styles.infoValue}>{user?.telefon || "—"}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{stats.utilajePostate}</Text>
            <Text style={styles.statLabel}>Utilaje postate</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{stats.rezervariFacute}</Text>
            <Text style={styles.statLabel}>Rezervări făcute</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.myMachineryButton}
          onPress={() => router.push("/utilajele-mele")}
        >
          <Text style={styles.myMachineryButtonText}>🚜 Utilajele mele</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Ieși din cont</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.offWhite },
  centerBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.offWhite,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  title: { fontSize: 20, fontWeight: "bold", color: COLORS.textDark },
  container: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.xl },
  avatarBox: { alignItems: "center", marginBottom: SPACING.lg },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.darkGreen,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  avatarInitials: { color: COLORS.gold, fontSize: 26, fontWeight: "bold" },
  userName: { fontSize: 18, fontWeight: "bold", color: COLORS.textDark },
  infoCard: {
    backgroundColor: "white",
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  infoRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 },
  infoLabel: { fontSize: 13, color: COLORS.textGray },
  infoValue: { fontSize: 13, color: COLORS.textDark, fontWeight: "600" },
  infoDivider: { height: 1, backgroundColor: "#f0ebe0", marginVertical: 4 },
  statsRow: { flexDirection: "row", gap: SPACING.md, marginBottom: SPACING.lg },
  statBox: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    alignItems: "center",
  },
  statValue: { fontSize: 24, fontWeight: "bold", color: COLORS.midGreen, marginBottom: 4 },
  statLabel: { fontSize: 11, color: COLORS.textGray, textAlign: "center" },
  myMachineryButton: {
    backgroundColor: COLORS.darkGreen,
    borderRadius: RADIUS.md,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  myMachineryButtonText: { color: COLORS.gold, fontWeight: "bold", fontSize: 15 },
  logoutButton: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: COLORS.danger,
    borderRadius: RADIUS.md,
    paddingVertical: 14,
    alignItems: "center",
  },
  logoutText: { color: COLORS.danger, fontWeight: "bold", fontSize: 15 },
});