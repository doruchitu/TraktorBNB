import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebase";
import { COLORS, SPACING, RADIUS } from "../../constants/theme";
import BackButton from "../../components/BackButton";

export default function Profil() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem("token");
      router.replace("/landing");
    } catch (err) {
      Alert.alert("Eroare", "Nu am putut ieși din cont.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <BackButton color={COLORS.textDark} />
        <Text style={styles.title}>👤 Profil</Text>
        <View style={{ width: 40 }} />
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Ieși din cont</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.offWhite,
    paddingTop: 60,
    paddingHorizontal: SPACING.lg,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.textDark,
    textAlign: "center",
  },
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