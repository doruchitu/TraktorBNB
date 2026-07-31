import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";
import UtilajCard from "../components/UtilajCard";
import BackButton from "../components/BackButton";
import { COLORS, SPACING, RADIUS } from "../constants/theme";

export default function UtilajeleMele() {
  const router = useRouter();
  const [utilaje, setUtilaje] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUtilajeleMele = useCallback(async () => {
    try {
      const [meRes, allRes] = await Promise.all([
        api.get("/users/me", {
          headers: { Authorization: `Bearer ${await AsyncStorage.getItem("token")}` },
        }),
        api.get("/machinery/"),
      ]);
      const myEmail = meRes.data.email;
      const mine = allRes.data.filter((u) => u.owner?.email === myEmail);
      setUtilaje(mine);
    } catch (err) {
      Alert.alert("Eroare", "Nu am putut încărca utilajele tale.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchUtilajeleMele();
  }, [fetchUtilajeleMele]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchUtilajeleMele();
  };

  const handleSterge = (utilajId) => {
    Alert.alert(
      "Confirmare",
      "Ești sigur că vrei să ștergi acest utilaj?",
      [
        { text: "Anulează", style: "cancel" },
        {
          text: "Șterge",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("token");
              await api.delete(`/machinery/${utilajId}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              setUtilaje((prev) => prev.filter((u) => u.id !== utilajId));
            } catch (err) {
              const detail = err.response?.data?.detail;
              Alert.alert(
                "Nu s-a putut șterge",
                typeof detail === "string" ? detail : "Utilajul are rezervări active."
              );
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.flex}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <BackButton />
          <Text style={styles.headerTitle}>🚜 Utilajele mele</Text>
          <View style={{ width: 40 }} />
        </View>
      </View>

      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={COLORS.darkGreen} />
        </View>
      ) : utilaje.length === 0 ? (
        <View style={styles.centerBox}>
          <Text style={styles.emptyEmoji}>📭</Text>
          <Text style={styles.emptyText}>Nu ai publicat niciun utilaj încă.</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push("/adauga-utilaj")}
          >
            <Text style={styles.addButtonText}>+ Adaugă primul utilaj</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={utilaje}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item }) => (
            <View>
              <UtilajCard
                utilaj={item}
                onPress={() => router.push(`/utilaj/${item.id}`)}
              />
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleSterge(item.id)}
              >
                <Text style={styles.deleteButtonText}>🗑️ Șterge acest utilaj</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.offWhite },
  header: {
    backgroundColor: COLORS.darkGreen,
    paddingTop: 60,
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerTitle: { color: COLORS.gold, fontSize: 18, fontWeight: "bold" },
  centerBox: { flex: 1, justifyContent: "center", alignItems: "center", padding: SPACING.xl },
  emptyEmoji: { fontSize: 48, marginBottom: SPACING.sm },
  emptyText: { color: "#aaa", marginBottom: SPACING.lg },
  addButton: {
    backgroundColor: COLORS.darkGreen,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 12,
  },
  addButtonText: { color: COLORS.gold, fontWeight: "bold" },
  list: { padding: SPACING.md },
  deleteButton: {
    marginTop: -SPACING.sm,
    marginBottom: SPACING.md,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: COLORS.danger,
    borderRadius: RADIUS.md,
    paddingVertical: 10,
    alignItems: "center",
  },
  deleteButtonText: { color: COLORS.danger, fontSize: 13, fontWeight: "bold" },
});