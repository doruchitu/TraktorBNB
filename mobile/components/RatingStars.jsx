import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS } from "../constants/theme";

export default function RatingStars({ rating, onRate, size = 20, readonly = false }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <View style={styles.row}>
      {stars.map((star) => (
        <TouchableOpacity
          key={star}
          disabled={readonly}
          onPress={() => onRate && onRate(star)}
          activeOpacity={readonly ? 1 : 0.6}
        >
          <Text
            style={[
              styles.star,
              { fontSize: size },
              star <= rating ? styles.starActive : styles.starInactive,
            ]}
          >
            ★
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 4 },
  star: { fontWeight: "bold" },
  starActive: { color: "#d4a017" },
  starInactive: { color: "#e0e0e0" },
});