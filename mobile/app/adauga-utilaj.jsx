import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Calendar } from "react-native-calendars";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";
import BackButton from "../components/BackButton";
import { COLORS, SPACING, RADIUS } from "../constants/theme";

const judete = ["Cluj", "Timiș", "Brașov", "Iași", "Sibiu", "Mureș", "Alba", "Galați", "Suceava", "Dolj"];

export default function AdaugaUtilaj() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    marca: "",
    model: "",
    tip: "",
    putere_cp: "",
    judet: "",
    pret_zi: "",
    descriere: "",
    data_disponibil_de: "",
    data_disponibil_pana: "",
  });
  const [imageUri, setImageUri] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showCalendarDe, setShowCalendarDe] = useState(false);
  const [showCalendarPana, setShowCalendarPana] = useState(false);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permisiune necesară", "Ai nevoie să permiți accesul la poze.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const uploadImageToCloudinary = async () => {
    if (!imageUri) return null;
    setUploading(true);
    try {
      const data = new FormData();
      data.append("file", {
        uri: imageUri,
        type: "image/jpeg",
        name: "utilaj.jpg",
      });
      data.append("upload_preset", process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: data }
      );
      const json = await res.json();
      return json.secure_url;
    } catch (err) {
      setError("Eroare la încărcarea imaginii.");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const validate = () => {
    if (!formData.marca || !formData.model || !formData.tip) {
      return "Marca, modelul și tipul sunt obligatorii.";
    }
    if (!formData.judet) {
      return "Județul este obligatoriu.";
    }
    if (!formData.pret_zi || isNaN(formData.pret_zi) || Number(formData.pret_zi) <= 0) {
      return "Prețul pe zi trebuie să fie un număr pozitiv.";
    }
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setLoading(true);

    try {
      let imagine_url = null;
      if (imageUri) {
        imagine_url = await uploadImageToCloudinary();
        if (!imagine_url) {
          setLoading(false);
          return;
        }
      }

      const token = await AsyncStorage.getItem("token");
      await api.post(
        "/machinery/",
        {
          ...formData,
          imagine_url,
          putere_cp: formData.putere_cp ? parseInt(formData.putere_cp) : null,
          pret_zi: parseFloat(formData.pret_zi),
          data_disponibil_de: formData.data_disponibil_de || null,
          data_disponibil_pana: formData.data_disponibil_pana || null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(true);
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (typeof detail === "string") {
        setError(detail);
      } else if (Array.isArray(detail)) {
        setError(detail.map((d) => d.msg).join(", "));
      } else {
        setError("Eroare la adăugarea utilajului.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <View style={styles.centerBox}>
        <Text style={styles.successEmoji}>🎉</Text>
        <Text style={styles.successTitle}>Utilaj publicat!</Text>
        <Text style={styles.successText}>
          Utilajul tău e acum vizibil pentru toți fermierii de pe platformă.
        </Text>
        <TouchableOpacity
          style={styles.backHomeButton}
          onPress={() => router.replace("/tabs/home")}
        >
          <Text style={styles.backHomeButtonText}>Înapoi la Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <BackButton color={COLORS.textDark} />
          <Text style={styles.title}>+ Adaugă Utilaj</Text>
          <View style={{ width: 40 }} />
        </View>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.previewImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imagePlaceholderEmoji}>📷</Text>
              <Text style={styles.imagePlaceholderText}>Adaugă o poză</Text>
            </View>
          )}
        </TouchableOpacity>

        <Text style={styles.label}>Marcă *</Text>
        <TextInput
          style={styles.input}
          placeholder="John Deere"
          placeholderTextColor="#aaa"
          value={formData.marca}
          onChangeText={(v) => updateField("marca", v)}
        />

        <Text style={styles.label}>Model *</Text>
        <TextInput
          style={styles.input}
          placeholder="6130R"
          placeholderTextColor="#aaa"
          value={formData.model}
          onChangeText={(v) => updateField("model", v)}
        />

        <Text style={styles.label}>Tip utilaj *</Text>
        <TextInput
          style={styles.input}
          placeholder="Tractor, combină, disc..."
          placeholderTextColor="#aaa"
          value={formData.tip}
          onChangeText={(v) => updateField("tip", v)}
        />

        <Text style={styles.label}>Putere (CP)</Text>
        <TextInput
          style={styles.input}
          placeholder="130"
          placeholderTextColor="#aaa"
          keyboardType="numeric"
          value={formData.putere_cp}
          onChangeText={(v) => updateField("putere_cp", v)}
        />

        <Text style={styles.label}>Județ *</Text>
        <View style={styles.judeteRow}>
          {judete.map((j) => (
            <TouchableOpacity
              key={j}
              style={[styles.judetChip, formData.judet === j && styles.judetChipActive]}
              onPress={() => updateField("judet", j)}
            >
              <Text
                style={[
                  styles.judetChipText,
                  formData.judet === j && styles.judetChipTextActive,
                ]}
              >
                {j}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Preț pe zi (lei) *</Text>
        <TextInput
          style={styles.input}
          placeholder="450"
          placeholderTextColor="#aaa"
          keyboardType="numeric"
          value={formData.pret_zi}
          onChangeText={(v) => updateField("pret_zi", v)}
        />

        <Text style={styles.label}>Disponibil de la</Text>
        <TouchableOpacity style={styles.input} onPress={() => setShowCalendarDe(true)}>
          <Text style={formData.data_disponibil_de ? styles.dateText : styles.datePlaceholder}>
            {formData.data_disponibil_de || "Selectează data"}
          </Text>
        </TouchableOpacity>

        {showCalendarDe && (
          <View style={styles.calendarBox}>
            <Calendar
              onDayPress={(day) => {
                updateField("data_disponibil_de", day.dateString);
                setShowCalendarDe(false);
              }}
              minDate={new Date().toISOString().split("T")[0]}
              markedDates={
                formData.data_disponibil_de
                  ? { [formData.data_disponibil_de]: { selected: true, selectedColor: COLORS.darkGreen } }
                  : {}
              }
              theme={{
                todayTextColor: COLORS.accentGreen,
                arrowColor: COLORS.darkGreen,
                selectedDayBackgroundColor: COLORS.darkGreen,
              }}
            />
            <TouchableOpacity onPress={() => setShowCalendarDe(false)} style={styles.closeCalendarButton}>
              <Text style={styles.closeCalendarText}>Închide</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.label}>Disponibil până la</Text>
        <TouchableOpacity style={styles.input} onPress={() => setShowCalendarPana(true)}>
          <Text style={formData.data_disponibil_pana ? styles.dateText : styles.datePlaceholder}>
            {formData.data_disponibil_pana || "Selectează data"}
          </Text>
        </TouchableOpacity>

        {showCalendarPana && (
          <View style={styles.calendarBox}>
            <Calendar
              onDayPress={(day) => {
                updateField("data_disponibil_pana", day.dateString);
                setShowCalendarPana(false);
              }}
              minDate={formData.data_disponibil_de || new Date().toISOString().split("T")[0]}
              markedDates={
                formData.data_disponibil_pana
                  ? { [formData.data_disponibil_pana]: { selected: true, selectedColor: COLORS.darkGreen } }
                  : {}
              }
              theme={{
                todayTextColor: COLORS.accentGreen,
                arrowColor: COLORS.darkGreen,
                selectedDayBackgroundColor: COLORS.darkGreen,
              }}
            />
            <TouchableOpacity onPress={() => setShowCalendarPana(false)} style={styles.closeCalendarButton}>
              <Text style={styles.closeCalendarText}>Închide</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.label}>Descriere</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="Detalii despre utilaj, accesorii incluse, condiții..."
          placeholderTextColor="#aaa"
          multiline
          numberOfLines={4}
          value={formData.descriere}
          onChangeText={(v) => updateField("descriere", v)}
        />

        <TouchableOpacity
          style={[styles.submitButton, (loading || uploading) && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading || uploading}
        >
          <Text style={styles.submitButtonText}>
            {uploading ? "Se încarcă poza..." : loading ? "Se publică..." : "🚜 Publică utilajul"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.offWhite },
  container: { padding: SPACING.lg, paddingTop: 60 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  title: { fontSize: 20, fontWeight: "bold", color: COLORS.textDark },
  errorBox: {
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fca5a5",
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
  },
  errorText: { color: COLORS.danger, fontSize: 13 },
  imagePicker: {
    height: 180,
    borderRadius: RADIUS.lg,
    overflow: "hidden",
    marginBottom: SPACING.lg,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  previewImage: { width: "100%", height: "100%" },
  imagePlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholderEmoji: { fontSize: 36, marginBottom: 6 },
  imagePlaceholderText: { color: "#aaa", fontSize: 13 },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textDark,
    marginBottom: SPACING.xs,
    marginTop: SPACING.md,
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.textDark,
    justifyContent: "center",
  },
  dateText: { fontSize: 14, color: COLORS.textDark },
  datePlaceholder: { fontSize: 14, color: "#aaa" },
  calendarBox: {
    backgroundColor: "white",
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  closeCalendarButton: {
    padding: SPACING.sm,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  closeCalendarText: { color: COLORS.darkGreen, fontWeight: "bold", fontSize: 13 },
  textarea: { height: 90, textAlignVertical: "top" },
  judeteRow: { flexDirection: "row", flexWrap: "wrap", gap: SPACING.xs },
  judetChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "white",
  },
  judetChipActive: { backgroundColor: COLORS.darkGreen, borderColor: COLORS.darkGreen },
  judetChipText: { fontSize: 13, color: "#555" },
  judetChipTextActive: { color: COLORS.gold, fontWeight: "bold" },
  submitButton: {
    backgroundColor: COLORS.darkGreen,
    borderRadius: RADIUS.md,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  submitButtonDisabled: { opacity: 0.6 },
  submitButtonText: { color: COLORS.gold, fontSize: 16, fontWeight: "bold" },
  centerBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.xl,
    backgroundColor: COLORS.offWhite,
  },
  successEmoji: { fontSize: 60, marginBottom: SPACING.md },
  successTitle: { fontSize: 20, fontWeight: "bold", color: COLORS.textDark, marginBottom: 8 },
  successText: { fontSize: 14, color: "#888", textAlign: "center", marginBottom: SPACING.lg },
  backHomeButton: {
    backgroundColor: COLORS.darkGreen,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 12,
  },
  backHomeButtonText: { color: COLORS.gold, fontWeight: "bold" },
});