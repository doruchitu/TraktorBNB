import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import api from "../../services/api";
import UtilajCard from "../../components/UtilajCard";
import { COLORS, SPACING, RADIUS } from "../../constants/theme";
import MenuDropdown from "../../components/MenuDropdown";

const judete = ["Toate", "Cluj", "Timiș", "Brașov", "Iași", "Sibiu", "Mureș", "Alba", "Galați", "Suceava", "Dolj"];

export default function Home() {
  const router = useRouter();
  const [utilaje, setUtilaje] = useState([]);
  const [ratings, setRatings] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [judetFiltrat, setJudetFiltrat] = useState("Toate");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchUtilaje = useCallback(async () => {
    setError("");
    try {
      const res = await api.get("/machinery/");
      setUtilaje(res.data);

      res.data.forEach((u) => {
        api
          .get(`/reviews/machinery/${u.id}`)
          .then((r) => {
            setRatings((prev) => ({
              ...prev,
              [u.id]: { average: r.data.average, count: r.data.count },
            }));
          })
          .catch(() => {});
      });
    } catch (err) {
      setError("Nu am putut încărca utilajele. Verifică conexiunea.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchUtilaje();
  }, [fetchUtilaje]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchUtilaje();
  };

  const utilajeFiltrate = utilaje.filter((u) => {
    const judetOk = judetFiltrat === "Toate" || u.judet === judetFiltrat;
    const searchOk =
      searchQuery === "" ||
      u.marca.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.judet.toLowerCase().includes(searchQuery.toLowerCase());
    return judetOk && searchOk;
  });

  return (
    <View style={styles.flex}>
      <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.headerTitle}>🚜 TraktorBNB</Text>
            <MenuDropdown />
          </View>
          <TextInput
            style={styles.search}
            placeholder="Caută marcă, model, județ..."
            placeholderTextColor="#aaa"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

      <View style={styles.filtersBox}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={judete}
          keyExtractor={(item) => item}
          contentContainerStyle={{ paddingHorizontal: SPACING.md, gap: SPACING.xs }}
          renderItem={({ item: j }) => (
            <TouchableOpacity
              onPress={() => setJudetFiltrat(j)}
              style={[
                styles.filterChip,
                judetFiltrat === j && styles.filterChipActive,
              ]}
            >
              <Text
                style={[
                  styles.filterChipText,
                  judetFiltrat === j && styles.filterChipTextActive,
                ]}
              >
                {j}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={COLORS.darkGreen} />
          <Text style={styles.loadingText}>Se încarcă utilajele...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerBox}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchUtilaje}>
            <Text style={styles.retryButtonText}>Încearcă din nou</Text>
          </TouchableOpacity>
        </View>
      ) : utilajeFiltrate.length === 0 ? (
        <View style={styles.centerBox}>
          <Text style={styles.emptyEmoji}>🔍</Text>
          <Text style={styles.emptyText}>Niciun utilaj găsit.</Text>
        </View>
      ) : (
        <FlatList
          data={utilajeFiltrate}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => (
            <UtilajCard
              utilaj={item}
              rating={ratings[item.id]}
              onPress={() => router.push(`/utilaj/${item.id}`)}
            />
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

  headerTop: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: SPACING.md,
  },

  headerTitle: {
    color: COLORS.gold,
    fontSize: 20,
    fontWeight: "bold",
  },
  search: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
    fontSize: 14,
  },
  filtersBox: {
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "white",
  },
  filterChipActive: {
    backgroundColor: COLORS.darkGreen,
    borderColor: COLORS.darkGreen,
  },
  filterChipText: { fontSize: 13, color: "#555" },
  filterChipTextActive: { color: COLORS.gold, fontWeight: "bold" },
  list: {
    padding: SPACING.md,
  },
  centerBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.xl,
  },
  loadingText: { marginTop: SPACING.sm, color: "#aaa" },
  errorText: { color: COLORS.danger, textAlign: "center", marginBottom: SPACING.md },
  retryButton: {
    backgroundColor: COLORS.darkGreen,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
  },
  retryButtonText: { color: COLORS.gold, fontWeight: "bold" },
  emptyEmoji: { fontSize: 48, marginBottom: SPACING.sm },
  emptyText: { color: "#aaa" },
});