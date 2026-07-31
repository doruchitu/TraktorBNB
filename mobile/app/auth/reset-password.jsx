import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../services/firebase";
import { COLORS, SPACING, RADIUS } from "../../constants/theme";

export default function ResetPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    setError("");
    setMessage("");
    if (!email.trim()) {
      setError("Introdu adresa de email.");
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Ți-am trimis un email cu instrucțiuni de resetare.");
    } catch (err) {
      setError("Nu am găsit un cont cu acest email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <View style={styles.logoBox}>
          <Text style={styles.logoEmoji}>🔑</Text>
          <Text style={styles.logoText}>Resetează parola</Text>
          <Text style={styles.tagline}>
            Introdu emailul contului tău și îți trimitem un link de resetare.
          </Text>
        </View>

        <View style={styles.form}>
          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {message ? (
            <View style={styles.successBox}>
              <Text style={styles.successText}>{message}</Text>
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

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleReset}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Se trimite..." : "Trimite link de resetare"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/auth/login")}>
            <Text style={styles.link}>← Înapoi la autentificare</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.darkGreen },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: SPACING.lg,
  },
  logoBox: {
    alignItems: "center",
    marginBottom: SPACING.xl,
  },
  logoEmoji: { fontSize: 48, marginBottom: SPACING.sm },
  logoText: {
    color: COLORS.gold,
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: SPACING.xs,
    textAlign: "center",
  },
  tagline: {
    color: COLORS.mutedGreen,
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
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
  errorBox: {
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fca5a5",
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  errorText: { color: COLORS.danger, fontSize: 13, textAlign: "center" },
  successBox: {
    backgroundColor: "#f0fdf4",
    borderWidth: 1,
    borderColor: "#86efac",
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  successText: { color: "#16a34a", fontSize: 13, textAlign: "center" },
});