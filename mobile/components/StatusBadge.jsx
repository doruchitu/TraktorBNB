import React from "react";
import { View, Text, StyleSheet } from "react-native";

const STATUS_CONFIG = {
  pending: { bg: "#fef3c7", color: "#d97706", label: "În așteptare" },
  approved: { bg: "#d1fae5", color: "#059669", label: "Aprobat" },
  rejected: { bg: "#fee2e2", color: "#dc2626", label: "Respins" },
  cancelled: { bg: "#f3f4f6", color: "#6b7280", label: "Anulat" },
  completed: { bg: "#dbeafe", color: "#2563eb", label: "Finalizat" },
};

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || { bg: "#f3f4f6", color: "#6b7280", label: status };

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <Text style={[styles.text, { color: config.color }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  text: {
    fontSize: 12,
    fontWeight: "bold",
  },
});