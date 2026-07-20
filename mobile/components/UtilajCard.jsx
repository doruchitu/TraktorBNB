import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS, SPACING, RADIUS } from "../constants/theme";

export default function UtilajCard({ utilaj, onPress, rating }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.imageBox}>
        {utilaj.imagine_url ? (
          <Image source={{ uri: utilaj.imagine_url }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderEmoji}>🚜</Text>
          </View>
        )}
        <View
          style={[
            styles.badge,
            { backgroundColor: utilaj.disponibil ? COLORS.success : "#c0392b" },
          ]}
        >
          <Text style={styles.badgeText}>
            {utilaj.disponibil ? "Disponibil" : "Indisponibil"}
          </Text>
        </View>
        <View style={styles.judetBadge}>
          <Text style={styles.judetText}>📍 {utilaj.judet}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>
          {utilaj.marca} {utilaj.model}
        </Text>
        <Text style={styles.putere}>
          ⚡ {utilaj.putere_cp ? `${utilaj.putere_cp} CP` : "—"}
        </Text>
        <Text style={styles.rating}>
          {rating?.average ? `⭐ ${rating.average} (${rating.count})` : "Fără recenzii încă"}
        </Text>

        <View style={styles.footer}>
          <Text style={styles.price}>
            {utilaj.pret_zi} lei
            <Text style={styles.priceUnit}> / zi</Text>
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  imageBox: {
    height: 150,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: COLORS.midGreen,
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholderEmoji: { fontSize: 48 },
  badge: {
    position: "absolute",
    top: 10,
    right: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: { color: "white", fontSize: 11, fontWeight: "600" },
  judetBadge: {
    position: "absolute",
    bottom: 10,
    left: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  judetText: { color: COLORS.gold, fontSize: 12 },
  content: { padding: SPACING.md },
  title: {
    fontSize: 17,
    fontWeight: "bold",
    color: COLORS.textDark,
    marginBottom: 4,
  },
  putere: {
    fontSize: 13,
    color: COLORS.textGray,
    marginBottom: 4,
  },
  rating: {
    fontSize: 13,
    color: "#d4a017",
    marginBottom: SPACING.sm,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#f0ebe0",
    paddingTop: SPACING.sm,
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.midGreen,
  },
  priceUnit: {
    fontSize: 13,
    fontWeight: "600",
    color: "#5a7a5a",
  },
});