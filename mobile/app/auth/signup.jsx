import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../../services/firebase";
import api from "../../services/api";
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

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nume: "",
    prenume: "",
    email: "",
    telefon: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    if (!formData.nume || !formData.prenume || !formData.email || !formData.telefon) {
      return "Toate câmpurile sunt obligatorii.";
    }
    if (formData.password.length < 6) {
      return "Parola trebuie să aibă minim 6 caractere.";
    }
    if (formData.password !== formData.confirmPassword) {
      return "Parolele nu coincid.";
    }
    if (!/^0[0-9]{9}$/.test(formData.telefon)) {
      return "Număr de telefon invalid.";
    }
    return null;
  };

const handleSignup = async () => {
  const validationError = validate();
  if (validationError) {
    setError(validationError);
    return;
  }
  setError("");
  setLoading(true);
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      formData.email,
      formData.password
    );

    await updateProfile(userCredential.user, {
      displayName: `${formData.prenume} ${formData.nume}`,
    });

    await api.post("/users/", {
      nume: formData.nume,
      prenume: formData.prenume,
      email: formData.email,
      telefon: formData.telefon,
      password: formData.password,
    });

    const token = await userCredential.user.getIdToken();
    await AsyncStorage.setItem("token", token);

    router.replace("/tabs/home");
  } catch (err) {
    if (err.code === "auth/email-already-in-use") {
      setError("Există deja un cont cu acest email.");
    } else if (err.code === "auth/weak-password") {
      setError("Parola este prea slabă.");
    } else {
      setError(err.response?.data?.detail || "Eroare la crearea contului.");
    }
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
          <Text style={styles.logoText}>Creează cont</Text>
          <Text style={styles.tagline}>Alătură-te comunității TraktorBNB</Text>
        </View>

        <View style={styles.form}>
          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.row}>
            <View style={styles.halfField}>
              <Text style={styles.label}>Nume</Text>
              <TextInput
                style={styles.input}
                placeholder="Popescu"
                placeholderTextColor={COLORS.textLightGray}
                value={formData.nume}
                onChangeText={(v) => updateField("nume", v)}
              />
            </View>
            <View style={styles.halfField}>
              <Text style={styles.label}>Prenume</Text>
              <TextInput
                style={styles.input}
                placeholder="Ion"
                placeholderTextColor={COLORS.textLightGray}
                value={formData.prenume}
                onChangeText={(v) => updateField("prenume", v)}
              />
            </View>
          </View>

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="email@exemplu.ro"
            placeholderTextColor={COLORS.textLightGray}
            value={formData.email}
            onChangeText={(v) => updateField("email", v)}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={styles.label}>Telefon</Text>
          <TextInput
            style={styles.input}
            placeholder="07XXXXXXXX"
            placeholderTextColor={COLORS.textLightGray}
            value={formData.telefon}
            onChangeText={(v) => updateField("telefon", v)}
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Parolă (minim 6 caractere)</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••"
            placeholderTextColor={COLORS.textLightGray}
            value={formData.password}
            onChangeText={(v) => updateField("password", v)}
            secureTextEntry
          />

          <Text style={styles.label}>Confirmă parola</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••"
            placeholderTextColor={COLORS.textLightGray}
            value={formData.confirmPassword}
            onChangeText={(v) => updateField("confirmPassword", v)}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSignup}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Se creează contul..." : "Creează Cont"}
            </Text>
          </TouchableOpacity>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Ai deja cont? </Text>
            <TouchableOpacity onPress={() => router.push("/auth/login")}>
              <Text style={styles.footerLink}>Autentifică-te</Text>
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
    marginBottom: SPACING.lg,
  },
  logoEmoji: { fontSize: 48, marginBottom: SPACING.sm },
  logoText: {
    color: COLORS.gold,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: SPACING.xs,
  },
  tagline: {
    color: COLORS.mutedGreen,
    fontSize: 13,
    fontStyle: "italic",
  },
  form: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
  },
  row: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
  halfField: { flex: 1 },
  label: {
    color: COLORS.textDark,
    fontSize: 13,
    fontWeight: "600",
    marginBottom: SPACING.xs,
    marginTop: SPACING.sm,
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