import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../../services/firebase";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { COLORS, SPACING, RADIUS } from "../../constants/theme";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

const handleLogin = async () => {
  setError("");
  if (!email.trim() || !password.trim()) {
    setError("Completează email și parolă.");
    return;
  }
  setLoading(true);
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();
    await AsyncStorage.setItem("token", token);
    router.replace("/tabs/home");
  } catch (err) {
    setError("Email sau parolă incorectă.");
  } finally {
    setLoading(false);
  }
};

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.logoBox}>
          <Text style={styles.logoEmoji}>🚜</Text>
          <Text style={styles.logoText}>TraktorBNB</Text>
          <Text style={styles.tagline}>Utilajul potrivit, în județul tău.</Text>
        </View>

        <View style={styles.form}>
          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="email@exemplu.ro"
            placeholderTextColor={COLORS.textLightGray}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={styles.label}>Parolă</Text>
          <TextInput
            style={styles.input}
            placeholder="Parola ta"
            placeholderTextColor={COLORS.textLightGray}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Se conectează..." : "Intră în cont"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/auth/reset-password")}>
            <Text style={styles.link}>Ai uitat parola?</Text>
          </TouchableOpacity>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Nu ai cont? </Text>
            <TouchableOpacity onPress={() => router.push("/auth/signup")}>
              <Text style={styles.footerLink}>Înregistrează-te</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.darkGreen },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: SPACING.lg,
  },
  logoBox: {
    alignItems: "center",
    marginBottom: SPACING.xl,
  },
  logoEmoji: { fontSize: 56, marginBottom: SPACING.sm },
  logoText: {
    color: COLORS.gold,
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: SPACING.xs,
  },
  tagline: {
    color: COLORS.mutedGreen,
    fontSize: 14,
    fontStyle: "italic",
  },
  form: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
  },
  label: {
    color: COLORS.textDark,
    fontSize: 13,
    fontWeight: "600",
    marginBottom: SPACING.xs,
    marginTop: SPACING.md,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.textDark,
  },
  button: {
    backgroundColor: COLORS.darkGreen,
    borderRadius: RADIUS.md,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: SPACING.lg,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: {
    color: COLORS.gold,
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    color: COLORS.accentGreen,
    fontSize: 13,
    textAlign: "center",
    marginTop: SPACING.md,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: SPACING.lg,
  },
  footerText: { color: "#666", fontSize: 13 },
  footerLink: { color: COLORS.accentGreen, fontSize: 13, fontWeight: "bold" },
  errorBox: {
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fca5a5",
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  errorText: { color: COLORS.danger, fontSize: 13, textAlign: "center" },
});