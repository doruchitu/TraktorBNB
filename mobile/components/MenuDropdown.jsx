import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from "react-native";
import { useRouter, usePathname } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import { COLORS, SPACING, RADIUS } from "../constants/theme";

export default function MenuDropdown() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const items = [
    { label: "Acasă", icon: "home", path: "/tabs/home" },
    { label: "Rezervări", icon: "calendar", path: "/tabs/rezervari" },
    { label: "Adaugă utilaj", icon: "add-circle", path: "/adauga-utilaj" },
    { label: "Profil", icon: "person", path: "/tabs/profil" },
  ];

  const navigateTo = (path) => {
    setOpen(false);
    router.push(path);
  };

  const handleLogout = async () => {
    setOpen(false);
    try {
      await signOut(auth);
      await AsyncStorage.removeItem("token");
      router.replace("/landing");
    } catch (err) {
      // silent
    }
  };

  return (
    <>
      <TouchableOpacity style={styles.menuButton} onPress={() => setOpen(true)}>
        <Ionicons name="menu" size={26} color={COLORS.gold} />
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setOpen(false)}
        >
          <View style={styles.dropdown}>
            {items.map((item) => {
              const active = pathname === item.path;
              return (
                <TouchableOpacity
                  key={item.path}
                  style={[styles.item, active && styles.itemActive]}
                  onPress={() => navigateTo(item.path)}
                >
                  <Ionicons
                    name={item.icon}
                    size={20}
                    color={active ? COLORS.darkGreen : "#555"}
                  />
                  <Text style={[styles.itemText, active && styles.itemTextActive]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}

            <View style={styles.divider} />

            <TouchableOpacity style={styles.item} onPress={handleLogout}>
              <Ionicons name="log-out" size={20} color={COLORS.danger} />
              <Text style={[styles.itemText, { color: COLORS.danger }]}>
                Ieși din cont
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  dropdown: {
    position: "absolute",
    top: 95,
    right: SPACING.md,
    backgroundColor: "white",
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.xs,
    minWidth: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    paddingVertical: 12,
    paddingHorizontal: SPACING.md,
  },
  itemActive: { backgroundColor: "#f0f7f0" },
  itemText: { fontSize: 14, color: "#333", fontWeight: "500" },
  itemTextActive: { color: COLORS.darkGreen, fontWeight: "bold" },
  divider: { height: 1, backgroundColor: "#eee", marginVertical: 4 },
});