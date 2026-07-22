import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Calendar } from "react-native-calendars";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../services/api";
import RatingStars from "../../components/RatingStars";
import { COLORS, SPACING, RADIUS } from "../../constants/theme";

export default function UtilajDetalii() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [utilaj, setUtilaj] = useState(null);
  const [loading, setLoading] = useState(true);
  const [zileOcupate, setZileOcupate] = useState([]);
  const [reviews, setReviews] = useState(null);

  const [dataStart, setDataStart] = useState(null);
  const [dataEnd, setDataEnd] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    fetchUtilaj();
    fetchZileOcupate();
    fetchReviews();
  }, [id]);

  const fetchUtilaj = async () => {
    try {
      const res = await api.get("/machinery/");
      const found = res.data.find((u) => String(u.id) === String(id));
      setUtilaj(found);
    } catch (err) {
      Alert.alert("Eroare", "Nu am putut încărca detaliile utilajului.");
    } finally {
      setLoading(false);
    }
  };

  const fetchZileOcupate = async () => {
    try {
      const res = await api.get(`/bookings/ocupate/${id}`);
      setZileOcupate(res.data.zile_ocupate);
    } catch (err) {
      setZileOcupate([]);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await api.get(`/reviews/machinery/${id}`);
      setReviews(res.data);
    } catch (err) {
      setReviews({ average: null, count: 0, reviews: [] });
    }
  };

  const markedDates = {};
  zileOcupate.forEach((zi) => {
    markedDates[zi] = { disabled: true, disableTouchEvent: true, marked: true, dotColor: "#e74c3c" };
  });
  if (dataStart) {
    markedDates[dataStart] = { ...markedDates[dataStart], startingDay: true, color: COLORS.darkGreen, textColor: "white" };
  }
  if (dataStart && dataEnd) {
    let current = new Date(dataStart);
    const end = new Date(dataEnd);
    while (current <= end) {
      const str = current.toISOString().split("T")[0];
      markedDates[str] = { ...markedDates[str], color: COLORS.darkGreen, textColor: "white" };
      current.setDate(current.getDate() + 1);
    }
    markedDates[dataEnd] = { ...markedDates[dataEnd], endingDay: true, color: COLORS.darkGreen, textColor: "white" };
  }

  const handleDayPress = (day) => {
    const str = day.dateString;
    if (zileOcupate.includes(str)) return;

    if (!dataStart || (dataStart && dataEnd)) {
      setDataStart(str);
      setDataEnd(null);
      setBookingError("");
    } else {
      if (str <= dataStart) {
        setDataStart(str);
        setDataEnd(null);
      } else {
        let current = new Date(dataStart);
        const end = new Date(str);
        let valid = true;
        while (current <= end) {
          const s = current.toISOString().split("T")[0];
          if (zileOcupate.includes(s)) { valid = false; break; }
          current.setDate(current.getDate() + 1);
        }
        if (!valid) {
          setBookingError("Există zile ocupate în intervalul selectat.");
          return;
        }
        setDataEnd(str);
        setBookingError("");
      }
    }
  };

  const calcZile = () => {
    if (!dataStart || !dataEnd) return 0;
    return Math.ceil((new Date(dataEnd) - new Date(dataStart)) / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleRezerva = async () => {
    if (!dataStart || !dataEnd) {
      setBookingError("Selectează data de start și data de sfârșit.");
      return;
    }
    setBookingLoading(true);
    setBookingError("");
    try {
      const token = await AsyncStorage.getItem("token");
      await api.post(
        "/bookings/",
        {
          utilaj_id: utilaj.id,
          data_start: new Date(dataStart).toISOString(),
          data_end: new Date(dataEnd).toISOString(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookingSuccess(true);
    } catch (err) {
      setBookingError(err.response?.data?.detail || "Eroare la rezervare.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerBox}>
        <ActivityIndicator size="large" color={COLORS.darkGreen} />
      </View>
    );
  }

  if (!utilaj) {
    return (
      <View style={styles.centerBox}>
        <Text style={styles.emptyText}>Utilajul nu a fost găsit.</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Înapoi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (bookingSuccess) {
    return (
      <View style={styles.centerBox}>
        <Text style={styles.successEmoji}>🎉</Text>
        <Text style={styles.successTitle}>Rezervare trimisă!</Text>
        <Text style={styles.successText}>
          Proprietarul va aproba sau respinge cererea ta în curând.
        </Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.replace("/tabs/home")}>
          <Text style={styles.backButtonText}>Înapoi la Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.flex}>
      <View style={styles.imageBox}>
        {utilaj.imagine_url ? (
          <Image source={{ uri: utilaj.imagine_url }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderEmoji}>🚜</Text>
          </View>
        )}
        <TouchableOpacity style={styles.backIconButton} onPress={() => router.back()}>
          <Text style={styles.backIconText}>←</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>
          {utilaj.marca} {utilaj.model}
        </Text>
        <Text style={styles.subtitle}>
          📍 {utilaj.judet} · ⚡ {utilaj.putere_cp ? `${utilaj.putere_cp} CP` : "Putere nespecificată"}
        </Text>

        <View style={styles.priceBox}>
          <Text style={styles.price}>
            {utilaj.pret_zi} lei<Text style={styles.priceUnit}> / zi</Text>
          </Text>
        </View>

        {utilaj.descriere ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📝 Descriere</Text>
            <Text style={styles.sectionText}>{utilaj.descriere}</Text>
          </View>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            ⭐ Recenzii {reviews?.count > 0 ? `(${reviews.count})` : ""}
          </Text>
          {!reviews ? (
            <Text style={styles.sectionText}>Se încarcă...</Text>
          ) : reviews.count === 0 ? (
            <Text style={styles.sectionText}>Niciun fermier nu a evaluat încă acest utilaj.</Text>
          ) : (
            <>
              <View style={styles.ratingSummary}>
                <Text style={styles.ratingAvg}>{reviews.average}</Text>
                <RatingStars rating={Math.round(reviews.average)} readonly size={16} />
                <Text style={styles.ratingCount}>din {reviews.count} recenzii</Text>
              </View>
              {reviews.reviews.map((rev, i) => (
                <View key={i} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <Text style={styles.reviewName}>{rev.client_nume}</Text>
                    <RatingStars rating={rev.rating} readonly size={12} />
                  </View>
                  {rev.comentariu ? (
                    <Text style={styles.reviewComment}>{rev.comentariu}</Text>
                  ) : null}
                </View>
              ))}
            </>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📅 Calendar disponibilitate</Text>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: "#27ae60" }]} />
              <Text style={styles.legendText}>Disponibil</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: "#e74c3c" }]} />
              <Text style={styles.legendText}>Ocupat</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.darkGreen }]} />
              <Text style={styles.legendText}>Selectat</Text>
            </View>
          </View>

          <Calendar
            markingType="period"
            markedDates={markedDates}
            onDayPress={handleDayPress}
            minDate={new Date().toISOString().split("T")[0]}
            theme={{
              todayTextColor: COLORS.accentGreen,
              arrowColor: COLORS.darkGreen,
              selectedDayBackgroundColor: COLORS.darkGreen,
            }}
          />

          {(dataStart || dataEnd) && (
            <View style={styles.intervalBox}>
              <View style={styles.intervalRow}>
                <Text style={styles.intervalLabel}>
                  Start: <Text style={styles.intervalValue}>{dataStart || "—"}</Text>
                </Text>
                <Text style={styles.intervalLabel}>
                  Sfârșit: <Text style={styles.intervalValue}>{dataEnd || "—"}</Text>
                </Text>
              </View>
              {dataStart && dataEnd && (
                <Text style={styles.totalText}>
                  💰 Total: {calcZile() * utilaj.pret_zi} lei ({calcZile()} zile)
                </Text>
              )}
            </View>
          )}

          {bookingError ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{bookingError}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={[
              styles.reserveButton,
              (!dataStart || !dataEnd || bookingLoading) && styles.reserveButtonDisabled,
            ]}
            onPress={handleRezerva}
            disabled={!dataStart || !dataEnd || bookingLoading}
          >
            <Text style={styles.reserveButtonText}>
              {bookingLoading ? "Se trimite..." : "🚜 Confirmă rezervarea"}
            </Text>
          </TouchableOpacity>
        </View>
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
    padding: SPACING.xl,
    backgroundColor: COLORS.offWhite,
  },
  imageBox: { height: 260, position: "relative" },
  image: { width: "100%", height: "100%" },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: COLORS.midGreen,
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholderEmoji: { fontSize: 64 },
  backIconButton: {
    position: "absolute",
    top: 50,
    left: SPACING.md,
    backgroundColor: "rgba(0,0,0,0.5)",
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
  },
  backIconText: { color: "white", fontSize: 20 },
  content: { padding: SPACING.lg },
  title: { fontSize: 24, fontWeight: "bold", color: COLORS.textDark, marginBottom: 6 },
  subtitle: { fontSize: 14, color: COLORS.textGray, marginBottom: SPACING.md },
  priceBox: {
    borderBottomWidth: 1,
    borderBottomColor: "#f0ebe0",
    paddingBottom: SPACING.md,
    marginBottom: SPACING.md,
  },
  price: { fontSize: 26, fontWeight: "bold", color: COLORS.midGreen },
  priceUnit: { fontSize: 14, fontWeight: "600", color: "#5a7a5a" },
  section: { marginBottom: SPACING.lg },
  sectionTitle: { fontSize: 15, fontWeight: "bold", color: COLORS.textDark, marginBottom: 8 },
  sectionText: { fontSize: 14, color: "#555", lineHeight: 20 },
  ratingSummary: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: SPACING.sm },
  ratingAvg: { fontSize: 20, fontWeight: "bold", color: COLORS.textDark },
  ratingCount: { fontSize: 13, color: COLORS.textGray },
  reviewCard: {
    backgroundColor: COLORS.offWhite,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  reviewHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  reviewName: { fontSize: 12, fontWeight: "bold", color: COLORS.textDark },
  reviewComment: { fontSize: 13, color: "#555", lineHeight: 18 },
  legendRow: { flexDirection: "row", gap: SPACING.md, marginBottom: SPACING.sm },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 11, color: "#555" },
  intervalBox: {
    backgroundColor: "#f0f7f0",
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: "#d4e8d4",
    padding: SPACING.sm,
    marginTop: SPACING.md,
  },
  intervalRow: { flexDirection: "row", justifyContent: "space-between" },
  intervalLabel: { fontSize: 13, color: "#5a7a5a" },
  intervalValue: { color: COLORS.textDark, fontWeight: "bold" },
  totalText: { marginTop: 8, color: COLORS.midGreen, fontWeight: "bold", fontSize: 14 },
  errorBox: {
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fca5a5",
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    marginTop: SPACING.sm,
  },
  errorText: { color: COLORS.danger, fontSize: 13 },
  reserveButton: {
    backgroundColor: COLORS.darkGreen,
    borderRadius: RADIUS.md,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: SPACING.md,
  },
  reserveButtonDisabled: { backgroundColor: "#ccc" },
  reserveButtonText: { color: COLORS.gold, fontSize: 15, fontWeight: "bold" },
  emptyText: { color: "#aaa", marginBottom: SPACING.md },
  successEmoji: { fontSize: 60, marginBottom: SPACING.md },
  successTitle: { fontSize: 20, fontWeight: "bold", color: COLORS.textDark, marginBottom: 8 },
  successText: { fontSize: 14, color: "#888", textAlign: "center", marginBottom: SPACING.lg },
  backButton: {
    backgroundColor: COLORS.darkGreen,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 12,
  },
  backButtonText: { color: COLORS.gold, fontWeight: "bold" },
});