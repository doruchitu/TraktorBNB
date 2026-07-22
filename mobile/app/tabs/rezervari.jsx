import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
  Alert,
  Linking,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import api from "../../services/api";
import StatusBadge from "../../components/StatusBadge";
import RatingStars from "../../components/RatingStars";
import { COLORS, SPACING, RADIUS } from "../../constants/theme";
import BackButton from "../../components/BackButton";

export default function Rezervari() {
  const [tab, setTab] = useState("client");
  const [rezervariMele, setRezervariMele] = useState([]);
  const [rezervariPrimite, setRezervariPrimite] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  const [modalRatingId, setModalRatingId] = useState(null);
  const [ratingValue, setRatingValue] = useState(0);
  const [reviewedBookings, setReviewedBookings] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const [mele, primite] = await Promise.all([
        api.get("/bookings/my", { headers }),
        api.get("/bookings/incoming", { headers }),
      ]);

      setRezervariMele(mele.data);
      setRezervariPrimite(primite.data);
    } catch (err) {
      Alert.alert("Eroare", "Nu am putut încărca rezervările.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleAction = async (bookingId, action) => {
    setActionLoading(bookingId + action);
    try {
      const token = await AsyncStorage.getItem("token");
      await api.put(
        `/bookings/${bookingId}/${action}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
    } catch (err) {
      Alert.alert("Eroare", "Acțiunea nu a putut fi finalizată.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDescarcaContract = async (bookingId) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const fileUri = FileSystem.documentDirectory + `contract_TBN_${String(bookingId).padStart(4, "0")}.pdf`;

      const downloadResult = await FileSystem.downloadAsync(
        `${api.defaults.baseURL}/contract/${bookingId}`,
        fileUri,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(downloadResult.uri);
      } else {
        Alert.alert("Descărcat", "Contractul a fost salvat pe dispozitiv.");
      }
    } catch (err) {
      Alert.alert("Eroare", "Nu am putut descărca contractul.");
    }
  };

  const handleTrimiteRating = async (bookingId) => {
    if (ratingValue === 0) {
      Alert.alert("Selectează un rating", "Alege minim o stea.");
      return;
    }
    try {
      const token = await AsyncStorage.getItem("token");
      await api.post(
        "/reviews/",
        { booking_id: bookingId, rating: ratingValue, comentariu: null },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReviewedBookings((prev) => [...prev, bookingId]);
      setModalRatingId(null);
      setRatingValue(0);
      Alert.alert("Mulțumim!", "Evaluarea ta a fost trimisă.");
    } catch (err) {
      Alert.alert("Eroare", err.response?.data?.detail || "Eroare la trimiterea evaluării.");
    }
  };

  const formatData = (dataStr) => {
    return new Date(dataStr).toLocaleDateString("ro-RO", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const calcZile = (start, end) => {
    return Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24)) + 1;
  };

  const renderRezervareClient = ({ item: r }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>🚜 {r.utilaj.marca} {r.utilaj.model}</Text>
          <Text style={styles.cardSubtitle}>📍 {r.utilaj.judet}</Text>
        </View>
        <StatusBadge status={r.status} />
      </View>

      <View style={styles.detailsBox}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>De la</Text>
          <Text style={styles.detailValue}>{formatData(r.data_start)}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Până la</Text>
          <Text style={styles.detailValue}>{formatData(r.data_end)}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Total</Text>
          <Text style={styles.detailValueBold}>
            {calcZile(r.data_start, r.data_end) * r.utilaj.pret_zi} lei
          </Text>
        </View>
      </View>

      <View style={styles.actionsRow}>
        {r.status === "pending" && (
          <TouchableOpacity
            style={styles.dangerButton}
            onPress={() => handleAction(r.id, "cancel")}
            disabled={actionLoading === r.id + "cancel"}
          >
            <Text style={styles.dangerButtonText}>
              {actionLoading === r.id + "cancel" ? "Se anulează..." : "Anulează"}
            </Text>
          </TouchableOpacity>
        )}
        {r.status === "approved" && (
          <>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => handleDescarcaContract(r.id)}
            >
              <Text style={styles.primaryButtonText}>📄 Descarcă contract</Text>
            </TouchableOpacity>
            {!reviewedBookings.includes(r.id) && (
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => { setModalRatingId(r.id); setRatingValue(0); }}
              >
                <Text style={styles.secondaryButtonText}>⭐ Evaluează</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>

      {modalRatingId === r.id && (
        <View style={styles.ratingBox}>
          <Text style={styles.ratingBoxTitle}>Cum a fost experiența ta?</Text>
          <View style={styles.ratingStarsCenter}>
            <RatingStars rating={ratingValue} onRate={setRatingValue} size={32} />
          </View>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => handleTrimiteRating(r.id)}
          >
            <Text style={styles.primaryButtonText}>Trimite evaluarea</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderRezervareProprietar = ({ item: r }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>🚜 {r.utilaj.marca} {r.utilaj.model}</Text>
          <Text style={styles.cardSubtitle}>
            👤 {r.client.nume} {r.client.prenume} · 📞 {r.client.telefon}
          </Text>
        </View>
        <StatusBadge status={r.status} />
      </View>

      <View style={styles.detailsBox}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>De la</Text>
          <Text style={styles.detailValue}>{formatData(r.data_start)}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Până la</Text>
          <Text style={styles.detailValue}>{formatData(r.data_end)}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Total</Text>
          <Text style={styles.detailValueBold}>
            {calcZile(r.data_start, r.data_end) * r.utilaj.pret_zi} lei
          </Text>
        </View>
      </View>

      <View style={styles.actionsRow}>
        {r.status === "pending" && (
          <>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => handleAction(r.id, "approve")}
              disabled={actionLoading === r.id + "approve"}
            >
              <Text style={styles.primaryButtonText}>
                {actionLoading === r.id + "approve" ? "Se aprobă..." : "✅ Aprobă"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dangerButton}
              onPress={() => handleAction(r.id, "reject")}
              disabled={actionLoading === r.id + "reject"}
            >
              <Text style={styles.dangerButtonText}>
                {actionLoading === r.id + "reject" ? "Se respinge..." : "❌ Respinge"}
              </Text>
            </TouchableOpacity>
          </>
        )}
        {r.status === "approved" && (
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => handleDescarcaContract(r.id)}
          >
            <Text style={styles.primaryButtonText}>📄 Descarcă contract</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const dataActiva = tab === "client" ? rezervariMele : rezervariPrimite;
  const renderItem = tab === "client" ? renderRezervareClient : renderRezervareProprietar;

  return (
    <View style={styles.flex}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <BackButton />
          <Text style={styles.headerTitle}>📋 Rezervările mele</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.tabsRow}>
          <TouchableOpacity
            style={[styles.tabButton, tab === "client" && styles.tabButtonActive]}
            onPress={() => setTab("client")}
          >
            <Text style={[styles.tabText, tab === "client" && styles.tabTextActive]}>
              🌾 Rezervările mele {rezervariMele.length > 0 && `(${rezervariMele.length})`}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, tab === "proprietar" && styles.tabButtonActive]}
            onPress={() => setTab("proprietar")}
          >
            <Text style={[styles.tabText, tab === "proprietar" && styles.tabTextActive]}>
              🚜 Cereri primite {rezervariPrimite.length > 0 && `(${rezervariPrimite.length})`}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={COLORS.darkGreen} />
        </View>
      ) : dataActiva.length === 0 ? (
        <View style={styles.centerBox}>
          <Text style={styles.emptyEmoji}>{tab === "client" ? "📋" : "📭"}</Text>
          <Text style={styles.emptyText}>
            {tab === "client"
              ? "Nu ai făcut nicio rezervare încă."
              : "Nu ai primit nicio cerere de rezervare încă."}
          </Text>
        </View>
      ) : (
        <FlatList
          data={dataActiva}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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
    textAlign: "center",
  },
  tabsRow: { flexDirection: "row", gap: SPACING.xs },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
  },
  tabButtonActive: { backgroundColor: COLORS.gold },
  tabText: { color: COLORS.mutedGreen, fontSize: 12, fontWeight: "600" },
  tabTextActive: { color: COLORS.darkGreen, fontWeight: "bold" },
  centerBox: { flex: 1, justifyContent: "center", alignItems: "center", padding: SPACING.xl },
  emptyEmoji: { fontSize: 48, marginBottom: SPACING.sm },
  emptyText: { color: "#aaa", textAlign: "center" },
  list: { padding: SPACING.md },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: SPACING.sm },
  cardTitle: { fontSize: 16, fontWeight: "bold", color: COLORS.textDark, marginBottom: 3 },
  cardSubtitle: { fontSize: 12, color: COLORS.textGray },
  detailsBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: COLORS.offWhite,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  detailItem: { flex: 1 },
  detailLabel: { fontSize: 10, color: "#aaa", textTransform: "uppercase", marginBottom: 2 },
  detailValue: { fontSize: 13, color: COLORS.textDark },
  detailValueBold: { fontSize: 13, color: COLORS.midGreen, fontWeight: "bold" },
  actionsRow: { flexDirection: "row", gap: SPACING.sm, flexWrap: "wrap" },
  primaryButton: {
    backgroundColor: COLORS.darkGreen,
    borderRadius: RADIUS.md,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flex: 1,
    alignItems: "center",
  },
  primaryButtonText: { color: COLORS.gold, fontSize: 13, fontWeight: "bold" },
  secondaryButton: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: COLORS.darkGreen,
    borderRadius: RADIUS.md,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flex: 1,
    alignItems: "center",
  },
  secondaryButtonText: { color: COLORS.darkGreen, fontSize: 13, fontWeight: "bold" },
  dangerButton: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: COLORS.danger,
    borderRadius: RADIUS.md,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flex: 1,
    alignItems: "center",
  },
  dangerButtonText: { color: COLORS.danger, fontSize: 13, fontWeight: "bold" },
  ratingBox: {
    marginTop: SPACING.sm,
    padding: SPACING.md,
    backgroundColor: COLORS.offWhite,
    borderRadius: RADIUS.md,
  },
  ratingBoxTitle: { fontSize: 13, color: COLORS.textDark, marginBottom: SPACING.sm, textAlign: "center" },
  ratingStarsCenter: { alignItems: "center", marginBottom: SPACING.md },
});