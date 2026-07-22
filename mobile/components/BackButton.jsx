import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { COLORS } from "../constants/theme";

export default function BackButton({ color = COLORS.gold }) {
  const router = useRouter();

  return (
    <TouchableOpacity style={styles.button} onPress={() => router.push("/tabs/home")}>
      <Text style={[styles.arrow, { color }]}>←</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(120,120,120,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  arrow: {
    fontSize: 22,
    fontWeight: "bold",
  },
});