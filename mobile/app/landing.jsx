import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { COLORS, SPACING, RADIUS } from "../constants/theme";

export default function Landing() {
  const router = useRouter();

  const features = [
    { icon: "🚜", title: "Închiriază utilaje", desc: "Găsește tractoare și echipamente disponibile în județul tău." },
    { icon: "📅", title: "Calendar inteligent", desc: "Vezi disponibilitatea în timp real, rezervă din câteva atingeri." },
    { icon: "📄", title: "Model de contract automat", desc: "La aprobare, se generează automat un model de contract." },
  ];

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.emoji}>🚜</Text>
        <Text style={styles.title}>TraktorBNB</Text>
        <Text style={styles.subtitle}>
          Utilajul potrivit,{"\n"}
          <Text style={styles.subtitleAccent}>la tine în județ.</Text>
        </Text>
        <Text style={styles.description}>
          Conectăm fermierii români. Închiriezi un utilaj când ai nevoie sau
          îl pui la muncă atunci când tu nu îl folosești.
        </Text>
      </View>

      <View style={styles.featuresBox}>
        {features.map((f, i) => (
          <View key={i} style={styles.featureCard}>
            <Text style={styles.featureIcon}>{f.icon}</Text>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>{f.title}</Text>
              <Text style={styles.featureDesc}>{f.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.launchBox}>
        <Text style={styles.launchText}>
          🚀 Fii printre primii care se conectează și postează sau
          închiriază un utilaj.
        </Text>
      </View>

      <View style={styles.buttonsBox}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push("/auth/signup")}
        >
          <Text style={styles.primaryButtonText}>🚜 Creează cont gratuit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push("/auth/login")}
        >
          <Text style={styles.secondaryButtonText}>Am deja cont</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.darkGreen },
  container: {
    flexGrow: 1,
    paddingBottom: SPACING.xl,
  },
  hero: {
    alignItems: "center",
    paddingTop: 80,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  emoji: { fontSize: 64, marginBottom: SPACING.sm },
  title: {
    color: COLORS.gold,
    fontSize: 34,
    fontWeight: "bold",
    marginBottom: SPACING.md,
  },
  subtitle: {
    color: COLORS.gold,
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 30,
    marginBottom: SPACING.md,
  },
  subtitleAccent: {
    color: COLORS.lightGreen,
  },
  description: {
    color: COLORS.mutedGreen,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: SPACING.md,
  },
  featuresBox: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  featureCard: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: "center",
    gap: SPACING.md,
  },
  featureIcon: { fontSize: 28 },
  featureText: { flex: 1 },
  featureTitle: {
    color: COLORS.gold,
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 2,
  },
  featureDesc: {
    color: COLORS.mutedGreen,
    fontSize: 12,
    lineHeight: 17,
  },
  launchBox: {
    marginHorizontal: SPACING.lg,
    backgroundColor: "rgba(232,213,163,0.1)",
    borderWidth: 1,
    borderColor: "rgba(232,213,163,0.3)",
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.xl,
  },
  launchText: {
    color: COLORS.gold,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    fontWeight: "600",
  },
  buttonsBox: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  primaryButton: {
    backgroundColor: COLORS.accentGreen,
    borderRadius: RADIUS.md,
    paddingVertical: 16,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "rgba(232,213,163,0.4)",
    borderRadius: RADIUS.md,
    paddingVertical: 16,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: COLORS.gold,
    fontSize: 16,
    fontWeight: "600",
  },
});